from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user with a role. Email is used as the login identifier."""

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        VENDOR = "vendor", "Vendor"
        CLIENT = "client", "Client"

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=10, choices=Role.choices, default=Role.CLIENT
    )
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    @property
    def is_vendor(self):
        return self.role == self.Role.VENDOR

    @property
    def is_client(self):
        return self.role == self.Role.CLIENT

    def save(self, *args, **kwargs):
        # Keep Django's admin/superuser concept aligned with our role.
        if self.is_superuser:
            self.role = self.Role.ADMIN
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email} ({self.role})"
