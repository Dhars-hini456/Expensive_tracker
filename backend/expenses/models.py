from decimal import Decimal

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

CATEGORY_CHOICES = [
    ('Food', 'Food'),
    ('Transport', 'Transport'),
    ('Shopping', 'Shopping'),
    ('Education', 'Education'),
    ('Bills', 'Bills'),
    ('Healthcare', 'Healthcare'),
    ('Entertainment', 'Entertainment'),
    ('Other', 'Other'),
]

PAYMENT_METHOD_CHOICES = [
    ('Cash', 'Cash'),
    ('Credit Card', 'Credit Card'),
    ('Debit Card', 'Debit Card'),
    ('UPI', 'UPI'),
    ('Bank Transfer', 'Bank Transfer'),
]


class Expense(models.Model):
    """Represents a single expense record."""

    title = models.CharField(max_length=200)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal('0.01'), message='Amount must be greater than 0.'),
            MaxValueValidator(Decimal('10000000'), message='Amount is unrealistically large.'),
        ],
    )
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    date = models.DateField()
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    description = models.TextField(max_length=1000, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'

    def __str__(self):
        return f'{self.title} - Rs.{self.amount} ({self.category})'
