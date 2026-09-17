from django.db.models import Count, Sum
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from .filters import ExpenseFilter
from .models import CATEGORY_CHOICES, PAYMENT_METHOD_CHOICES, Expense
from .serializers import ExpenseSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    Full CRUD API for Expense records, plus search, filter,
    ordering and summary/statistics endpoints.

    GET    /api/expenses/                -> list (supports ?search=, ?category=,
                                             ?date=, ?date_from=, ?date_to=, ?ordering=)
    POST   /api/expenses/                -> create
    GET    /api/expenses/{id}/           -> retrieve
    PUT    /api/expenses/{id}/           -> full update
    PATCH  /api/expenses/{id}/           -> partial update
    DELETE /api/expenses/{id}/           -> delete
    GET    /api/expenses/summary/        -> totals + category/payment breakdown
    GET    /api/expenses/categories/     -> list of valid categories
    GET    /api/expenses/payment_methods/-> list of valid payment methods
    """

    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ExpenseFilter
    search_fields = ['title', 'description']
    ordering_fields = ['date', 'amount', 'created_at', 'title']
    ordering = ['-date', '-created_at']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {'message': 'Expense created successfully.', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'message': 'Expense updated successfully.', 'data': serializer.data})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        title = instance.title
        self.perform_destroy(instance)
        return Response(
            {'message': f'Expense "{title}" deleted successfully.'},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Aggregate totals and a category-wise / payment-method-wise breakdown."""
        queryset = self.filter_queryset(self.get_queryset())

        totals = queryset.aggregate(total_amount=Sum('amount'), total_count=Count('id'))

        category_summary = []
        for cat_value, _label in CATEGORY_CHOICES:
            cat_totals = queryset.filter(category=cat_value).aggregate(
                total=Sum('amount'), count=Count('id')
            )
            if cat_totals['count']:
                category_summary.append({
                    'category': cat_value,
                    'total': cat_totals['total'] or 0,
                    'count': cat_totals['count'],
                })
        category_summary.sort(key=lambda c: c['total'], reverse=True)

        payment_summary = list(
            queryset.values('payment_method')
            .annotate(total=Sum('amount'), count=Count('id'))
            .order_by('-total')
        )

        return Response({
            'total_amount': totals['total_amount'] or 0,
            'total_count': totals['total_count'] or 0,
            'category_summary': category_summary,
            'payment_method_summary': payment_summary,
        })

    @action(detail=False, methods=['get'])
    def categories(self, request):
        return Response([{'value': value, 'label': label} for value, label in CATEGORY_CHOICES])

    @action(detail=False, methods=['get'])
    def payment_methods(self, request):
        return Response([{'value': value, 'label': label} for value, label in PAYMENT_METHOD_CHOICES])
