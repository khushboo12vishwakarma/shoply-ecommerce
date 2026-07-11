"""Seed demo data: users (admin/vendor/client), categories and products.

Run with:  python manage.py seed
"""
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from catalog.models import Category, Product

User = get_user_model()

# Curated Unsplash photos (square-cropped, 600px).
_UNSPLASH = "https://images.unsplash.com/photo-{id}?w=600&h=600&fit=crop&q=80"

CATEGORIES = [
    ("Electronics", "Phones, laptops, and gadgets", _UNSPLASH.format(id="1498049794561-7780e7231661")),
    ("Home & Kitchen", "Everything for your home", _UNSPLASH.format(id="1556911220-e15b29be8c8f")),
    ("Books", "Bestsellers and classics", _UNSPLASH.format(id="1544716278-ca5e3f4abd8c")),
    ("Fashion", "Clothing and accessories", _UNSPLASH.format(id="1445205170230-053b83016050")),
    ("Sports", "Gear and outdoor equipment", _UNSPLASH.format(id="1461896836934-ffe607ba8211")),
]

# (name, category, price_in_inr, stock, image_url)
PRODUCTS = [
    ("Wireless Headphones", "Electronics", "1999", 40, _UNSPLASH.format(id="1505740420928-5e560c06d30e")),
    ("4K Smart TV 55\"", "Electronics", "42999", 15, _UNSPLASH.format(id="1593784991095-a205069470b6")),
    ("Mechanical Keyboard", "Electronics", "6499", 30, _UNSPLASH.format(id="1587829741301-dc798b83add3")),
    ("Stainless Steel Cookware Set", "Home & Kitchen", "4999", 20, _UNSPLASH.format(id="1556909212-d5b604d0c90d")),
    ("Espresso Machine", "Home & Kitchen", "18999", 12, _UNSPLASH.format(id="1517668808822-9ebb02f2a0e6")),
    ("The Pragmatic Programmer", "Books", "1299", 100, _UNSPLASH.format(id="1544716278-ca5e3f4abd8c")),
    ("Clean Code", "Books", "999", 80, _UNSPLASH.format(id="1512820790803-83ca734da794")),
    ("Running Shoes", "Fashion", "3499", 50, _UNSPLASH.format(id="1542291026-7eec264c27ff")),
    ("Leather Wallet", "Fashion", "899", 60, _UNSPLASH.format(id="1627123424574-724758594e93")),
    ("Yoga Mat", "Sports", "799", 70, _UNSPLASH.format(id="1544367567-0f2fcb009e0b")),
    ("Adjustable Dumbbell", "Sports", "5999", 18, _UNSPLASH.format(id="1638536532686-d610adfc8e5c")),
]


class Command(BaseCommand):
    help = "Seed the database with demo users, categories and products."

    def handle(self, *args, **options):
        # ── Users ──
        admin, created = User.objects.get_or_create(
            email="admin@shop.com",
            defaults={"username": "admin", "is_staff": True, "is_superuser": True},
        )
        if created:
            admin.set_password("admin1234")
            admin.save()
            self.stdout.write("Created admin -> admin@shop.com / admin1234")

        vendor, created = User.objects.get_or_create(
            email="vendor@shop.com",
            defaults={"username": "vendor", "role": User.Role.VENDOR},
        )
        if created:
            vendor.set_password("vendor1234")
            vendor.save()
            self.stdout.write("Created vendor -> vendor@shop.com / vendor1234")

        client, created = User.objects.get_or_create(
            email="client@shop.com",
            defaults={"username": "client", "role": User.Role.CLIENT},
        )
        if created:
            client.set_password("client1234")
            client.save()
            self.stdout.write("Created client -> client@shop.com / client1234")

        # ── Categories ──
        cat_map = {}
        for name, desc, image_url in CATEGORIES:
            cat, _ = Category.objects.get_or_create(
                name=name, defaults={"description": desc, "image_url": image_url}
            )
            cat.description = desc
            cat.image_url = image_url
            cat.save(update_fields=["description", "image_url"])
            cat_map[name] = cat

        # ── Products ──
        for name, cat_name, price, stock, image_url in PRODUCTS:
            obj, _ = Product.objects.get_or_create(
                name=name,
                defaults={
                    "category": cat_map[cat_name],
                    "vendor": vendor,
                    "price": Decimal(price),
                    "stock": stock,
                    "description": f"High quality {name.lower()}.",
                    "is_active": True,
                    "image_url": image_url,
                },
            )
            # Keep price/image fresh even if the product already existed.
            obj.price = Decimal(price)
            obj.image_url = image_url
            obj.save(update_fields=["price", "image_url"])

        self.stdout.write(self.style.SUCCESS("Seed complete."))
