import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { deleteExpense, getExpense } from '../api/expenseApi';
import { CATEGORY_ICONS } from '../constants';
import { useNotification } from '../context/NotificationContext';
import DeleteConfirmModal from './DeleteConfirmModal';

function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    getExpense(id)
      .then((res) => setExpense(res.data))
      .catch(() => setError('Expense not found. It may have been deleted, or the ID is invalid.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteExpense(id);
      showNotification('Expense deleted successfully.', 'success');
      navigate('/');
    } catch {
      showNotification('Failed to delete the expense.', 'error');
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) {
    return (
      <div className="form-page">
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }
  if (!expense) return null;

  return (
    <div className="form-page">
      <div className="card form-card detail-card">
        <div className="detail-header">
          <h1>
            {CATEGORY_ICONS[expense.category] || '📦'} {expense.title}
          </h1>
          <span className="category-badge">{expense.category}</span>
        </div>

        <div className="detail-grid">
          <div>
            <span className="detail-label">Amount</span>
            <span className="detail-value amount-cell">₹{Number(expense.amount).toFixed(2)}</span>
          </div>
          <div>
            <span className="detail-label">Date</span>
            <span className="detail-value">{expense.date}</span>
          </div>
          <div>
            <span className="detail-label">Payment Method</span>
            <span className="detail-value">{expense.payment_method}</span>
          </div>
          <div>
            <span className="detail-label">Created At</span>
            <span className="detail-value">{new Date(expense.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div className="detail-description">
          <span className="detail-label">Description</span>
          <p>{expense.description || 'No description provided.'}</p>
        </div>

        <div className="form-actions">
          <Link to="/" className="btn btn-secondary">
            Back
          </Link>
          <Link to={`/edit/${expense.id}`} className="btn btn-primary">
            Edit
          </Link>
          <button className="btn btn-danger" onClick={() => setShowDelete(true)}>
            Delete
          </button>
        </div>
      </div>

      {showDelete && (
        <DeleteConfirmModal expense={expense} onCancel={() => setShowDelete(false)} onConfirm={handleDelete} />
      )}
    </div>
  );
}

export default ExpenseDetail;
