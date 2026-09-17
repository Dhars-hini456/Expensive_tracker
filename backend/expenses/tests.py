from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Expense


class ExpenseAPITests(APITestCase):
    def setUp(self):
        self.expense = Expense.objects.create(
            title='Lunch',
            amount=Decimal('250.00'),
            category='Food',
            date='2026-01-05',
            payment_method='Cash',
            description='Team lunch',
        )
        self.list_url = reverse('expense-list')

    def test_list_expenses(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_expense_success(self):
        payload = {
            'title': 'Bus ticket',
            'amount': '50.00',
            'category': 'Transport',
            'date': '2026-01-06',
            'payment_method': 'UPI',
            'description': 'Daily commute',
        }
        response = self.client.post(self.list_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Expense.objects.count(), 2)

    def test_create_expense_invalid_amount(self):
        payload = {
            'title': 'Invalid',
            'amount': '-10.00',
            'category': 'Other',
            'date': '2026-01-06',
            'payment_method': 'Cash',
        }
        response = self.client.post(self.list_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_expense_empty_title(self):
        payload = {
            'title': '   ',
            'amount': '10.00',
            'category': 'Other',
            'date': '2026-01-06',
            'payment_method': 'Cash',
        }
        response = self.client.post(self.list_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_invalid_id(self):
        url = reverse('expense-detail', args=[9999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_expense(self):
        url = reverse('expense-detail', args=[self.expense.id])
        response = self.client.patch(url, {'amount': '300.00'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.expense.refresh_from_db()
        self.assertEqual(self.expense.amount, Decimal('300.00'))

    def test_delete_expense(self):
        url = reverse('expense-detail', args=[self.expense.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Expense.objects.count(), 0)

    def test_summary_endpoint(self):
        url = reverse('expense-summary')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_amount', response.data)
