from django.db import transaction
from django.db.models import Count, Sum
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from cart.models import Cart

from .models import Order, OrderItem
from .serializers import OrderSerializer


class OrderViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """List / retrieve orders and place a new order from the cart."""

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects.filter(user=self.request.user)
            .prefetch_related("items")
        )

    @action(detail=False, methods=["post"])
    def checkout(self, request):
        """Turn the current cart into an order."""
        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return Response(
                {"detail": "Your cart is empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                shipping_address=request.data.get(
                    "shipping_address", request.user.address
                ),
                status=Order.Status.PAID,  # simplified: mark paid immediately
            )
            for item in cart.items.select_related("product"):
                product = item.product
                qty = min(item.quantity, product.stock)
                if qty <= 0:
                    continue
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    product_name=product.name,
                    price=product.price,
                    quantity=qty,
                )
                product.stock -= qty
                product.save(update_fields=["stock"])
            order.recalculate_total()
            cart.items.all().delete()

        return Response(
            OrderSerializer(order).data, status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=["get"])
    def statement(self, request):
        """Account statement: spend summary + counts by status."""
        qs = Order.objects.filter(user=request.user)
        agg = qs.aggregate(total_spent=Sum("total"), order_count=Count("id"))
        by_status = list(
            qs.values("status")
            .annotate(count=Count("id"), amount=Sum("total"))
            .order_by("status")
        )
        return Response(
            {
                "total_spent": agg["total_spent"] or 0,
                "order_count": agg["order_count"] or 0,
                "by_status": by_status,
            }
        )
