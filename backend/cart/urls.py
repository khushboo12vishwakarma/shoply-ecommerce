from django.urls import path

from .views import CartViewSet

cart_list = CartViewSet.as_view({"get": "list"})
cart_add = CartViewSet.as_view({"post": "add"})
cart_update = CartViewSet.as_view({"post": "update_item"})
cart_remove = CartViewSet.as_view({"post": "remove"})
cart_clear = CartViewSet.as_view({"post": "clear"})

urlpatterns = [
    path("cart/", cart_list, name="cart"),
    path("cart/add/", cart_add, name="cart-add"),
    path("cart/update_item/", cart_update, name="cart-update"),
    path("cart/remove/", cart_remove, name="cart-remove"),
    path("cart/clear/", cart_clear, name="cart-clear"),
]
