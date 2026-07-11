from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from catalog.models import Product

from .models import Cart, CartItem
from .serializers import CartSerializer


class CartViewSet(ViewSet):
    """Single-cart-per-user operations."""

    permission_classes = [IsAuthenticated]

    def _get_cart(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart

    def list(self, request):
        """GET /api/cart/ — return the current user's cart."""
        cart = self._get_cart(request)
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["post"])
    def add(self, request):
        """POST /api/cart/add/  { product: id, quantity: n }"""
        cart = self._get_cart(request)
        product = Product.objects.filter(
            pk=request.data.get("product"), is_active=True
        ).first()
        if not product:
            return Response(
                {"detail": "Product not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        try:
            quantity = int(request.data.get("quantity", 1))
        except (TypeError, ValueError):
            quantity = 1
        quantity = max(1, quantity)

        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        item.quantity = quantity if created else item.quantity + quantity
        if item.quantity > product.stock:
            item.quantity = product.stock or 1
        item.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def update_item(self, request):
        """POST /api/cart/update_item/  { product: id, quantity: n }"""
        cart = self._get_cart(request)
        item = CartItem.objects.filter(
            cart=cart, product_id=request.data.get("product")
        ).first()
        if not item:
            return Response(
                {"detail": "Item not in cart."},
                status=status.HTTP_404_NOT_FOUND,
            )
        quantity = int(request.data.get("quantity", 1))
        if quantity <= 0:
            item.delete()
        else:
            item.quantity = min(quantity, item.product.stock or quantity)
            item.save()
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["post"])
    def remove(self, request):
        """POST /api/cart/remove/  { product: id }"""
        cart = self._get_cart(request)
        CartItem.objects.filter(
            cart=cart, product_id=request.data.get("product")
        ).delete()
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["post"])
    def clear(self, request):
        cart = self._get_cart(request)
        cart.items.all().delete()
        return Response(CartSerializer(cart).data)
