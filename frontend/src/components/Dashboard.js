import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { deleteExpense, getExpenses, getSummary } from '../api/expenseApi';
import { useNotification } from '../context/NotificationContext';
import CategorySummary from './CategorySummary';
import DeleteConfirmModal from './DeleteConfirmModal';
import ExpenseList from './ExpenseList';
import SearchFilter from './SearchFilter';
import SummaryCards from './SummaryCards';

const defaultSummary = {
  total_amount: 0,
  total_count: 0,
  category_summary: [],
  payment_method_summary: [],
};

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(defaultSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    date_from: '',
    date_to: '',
    ordering: '-date',
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { showNotification } = useNotification();

  const buildParams = useCallback(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    if (filters.ordering) params.ordering = filters.ordering;
    return params;
  }, [filters]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = buildParams();
      const [expensesRes, summaryRes] = await Promise.all([getExpenses(params), getSummary(params)]);
      const data = expensesRes.data;
      const list = Array.isArray(data) ? data : data.results || [];
      setExpenses(list);
      setSummary(summaryRes.data);
    } catch (err) {
      setError('Failed to load expenses. Please check that the backend server is running on http://127.0.0.1:8000.');
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExpense(deleteTarget.id);
      showNotification(`"${deleteTarget.title}" was deleted successfully.`, 'success');
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      showNotification('Failed to delete the expense. Please try again.', 'error');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Track and manage your daily expenses</p>
        </div>
        <Link to="/add" className="btn btn-primary">
          + Add Expense
        </Link>
      </div>

      <SummaryCards summary={summary} />
      <CategorySummary categorySummary={summary.category_summary} />

      <SearchFilter filters={filters} setFilters={setFilters} />

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading expenses...</div>
      ) : (
        <ExpenseList expenses={expenses} onDeleteRequest={setDeleteTarget} />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          expense={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirmed}
        />
      )}
    </div>
  );
}

export default Dashboard;
