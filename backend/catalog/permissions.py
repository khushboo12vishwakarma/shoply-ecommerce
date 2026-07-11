from rest_framework import permissions


class IsVendorOrAdmin(permissions.BasePermission):
    """Only vendors and admins may create/modify products."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and user.role in ("vendor", "admin"))

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        # Admins can edit anything; vendors only their own products.
        return user.role == "admin" or obj.vendor_id == user.id
