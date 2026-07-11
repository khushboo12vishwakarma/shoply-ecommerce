from rest_framework import viewsets

from .models import Category, Product
from .permissions import IsVendorOrAdmin
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsVendorOrAdmin]
    lookup_field = "slug"
    search_fields = ["name"]


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsVendorOrAdmin]
    lookup_field = "slug"
    # category-based filtering + free-text search + ordering
    filterset_fields = ["category", "category__slug", "vendor"]
    search_fields = ["name", "description", "category__name"]
    ordering_fields = ["price", "created_at", "name"]

    def get_queryset(self):
        qs = Product.objects.select_related("category", "vendor")
        # Public storefront only sees active products; a vendor viewing
        # their own dashboard can pass ?mine=1 to see everything.
        if self.request.query_params.get("mine") and self.request.user.is_authenticated:
            return qs.filter(vendor=self.request.user)
        return qs.filter(is_active=True)

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)
