import datetime
from decimal import Decimal

from rest_framework import serializers

from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = [
            'id', 'title', 'amount', 'category', 'date',
            'payment_method', 'description', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Title cannot be empty.')
        if len(value.strip()) < 2:
            raise serializers.ValidationError('Title must be at least 2 characters long.')
        if len(value.strip()) > 200:
            raise serializers.ValidationError('Title cannot exceed 200 characters.')
        return value.strip()

    def validate_amount(self, value):
        if value is None:
            raise serializers.ValidationError('Amount is required.')
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than 0.')
        if value > Decimal('10000000'):
            raise serializers.ValidationError('Amount is unrealistically large.')
        return value

    def validate_date(self, value):
        if value > datetime.date.today():
            raise serializers.ValidationError('Date cannot be in the future.')
        return value

    def validate_description(self, value):
        if value and len(value) > 1000:
            raise serializers.ValidationError('Description cannot exceed 1000 characters.')
        return value

    def validate(self, attrs):
        # Extra cross-field sanity check
        if 'amount' in attrs and attrs['amount'] is not None and attrs['amount'] <= 0:
            raise serializers.ValidationError({'amount': 'Amount must be greater than 0.'})
        return attrs
