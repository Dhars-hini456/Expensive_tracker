from decimal import Decimal

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('amount', models.DecimalField(
                    decimal_places=2,
                    max_digits=10,
                    validators=[
                        django.core.validators.MinValueValidator(Decimal('0.01'), message='Amount must be greater than 0.'),
                        django.core.validators.MaxValueValidator(Decimal('10000000'), message='Amount is unrealistically large.'),
                    ],
                )),
                ('category', models.CharField(choices=[
                    ('Food', 'Food'),
                    ('Transport', 'Transport'),
                    ('Shopping', 'Shopping'),
                    ('Education', 'Education'),
                    ('Bills', 'Bills'),
                    ('Healthcare', 'Healthcare'),
                    ('Entertainment', 'Entertainment'),
                    ('Other', 'Other'),
                ], max_length=20)),
                ('date', models.DateField()),
                ('payment_method', models.CharField(choices=[
                    ('Cash', 'Cash'),
                    ('Credit Card', 'Credit Card'),
                    ('Debit Card', 'Debit Card'),
                    ('UPI', 'UPI'),
                    ('Bank Transfer', 'Bank Transfer'),
                ], max_length=20)),
                ('description', models.TextField(blank=True, default='', max_length=1000)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Expense',
                'verbose_name_plural': 'Expenses',
                'ordering': ['-date', '-created_at'],
            },
        ),
    ]
