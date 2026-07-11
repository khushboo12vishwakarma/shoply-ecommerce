from rest_framework import serializers

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(
        source="products.count", read_only=True
    )

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "image_url", "product_count"]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    vendor_name = serializers.CharField(source="vendor.username", read_only=True)
    in_stock = serializers.BooleanField(read_only=True)
    # Resolved image: uploaded file if present, otherwise the external URL.
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "description", "price", "stock",
            "in_stock", "image", "image_url", "is_active",
            "category", "category_name", "vendor", "vendor_name",
            "created_at",
        ]
        read_only_fields = ["id", "slug", "vendor", "created_at"]

    def get_image(self, obj):
        if obj.image:
            request = self.context.get("request")
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url
        return obj.image_url or None
