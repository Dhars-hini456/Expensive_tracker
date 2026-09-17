import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { createExpense, getExpense, updateExpense } from '../api/expenseApi';
import { CATEGORIES, PAYMENT_METHODS } from '../constants';
import { useNotification } from '../context/NotificationContext';

const emptyForm = {
  title: '',
  amount: '',
  category: '',
  date: '',
  payment_method: '',
  description: '',
};

function ExpenseForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit' && id) {
      getExpense(id)
        .then((res) => {
          const d = res.data;
          setForm({
            title: d.title,
            amount: d.amount,
            category: d.category,
            date: d.date,
            payment_method: d.payment_method,
            description: d.description || '',
          });
        })
        .catch(() => showNotification('Could not load the requested expense.', 'error'))
        .finally(() => setLoading(false));
    }
  }, [mode, id, showNotification]);

  const validate = () => {
    const newErrors = {};

    if (!form.title || !form.title.trim()) {
      newErrors.title = 'Title cannot be empty.';
    } else if (form.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters long.';
    } else if (form.title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters.';
    }

    const amountNum = parseFloat(form.amount);
    if (form.amount === '' || form.amount === null || isNaN(amountNum)) {
      newErrors.amount = 'Amount is required.';
    } else if (amountNum <= 0) {
      newErrors.amount = 'Amount must be greater than 0.';
    } else if (amountNum > 10000000) {
      newErrors.amount = 'Amount is unrealistically large.';
    }

    if (!form.category) newErrors.category = 'Category is required.';

    if (!form.date) {
      newErrors.date = 'Date is required.';
    } else if (new Date(form.date) > new Date()) {
      newErrors.date = 'Date cannot be in the future.';
    }

    if (!form.payment_method) newErrors.payment_method = 'Payment method is required.';

    if (form.description && form.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload = { ...form, amount: parseFloat(form.amount) };

    try {
      if (mode === 'edit') {
        await updateExpense(id, payload);
        showNotification('Expense updated successfully.', 'success');
      } else {
        await createExpense(payload);
        showNotification('Expense added successfully.', 'success');
      }
      navigate('/');
    } catch (err) {
      const data = err.response && err.response.data;
      if (data && typeof data === 'object') {
        const serverErrors = {};
        Object.keys(data).forEach((key) => {
          serverErrors[key] = Array.isArray(data[key]) ? data[key].join(' ') : String(data[key]);
        });
        setErrors(serverErrors);
        showNotification('Please fix the highlighted errors and try again.', 'error');
      } else {
        showNotification('Something went wrong. Please check the backend server and try again.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="form-page">
      <div className="card form-card">
        <h1>{mode === 'edit' ? 'Edit Expense' : 'Add New Expense'}</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={errors.title ? 'input input-error' : 'input'}
              placeholder="e.g. Grocery shopping"
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount (₹) *</label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className={errors.amount ? 'input input-error' : 'input'}
                placeholder="0.00"
              />
              {errors.amount && <span className="field-error">{errors.amount}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={errors.date ? 'input input-error' : 'input'}
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={errors.category ? 'input input-error' : 'input'}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="payment_method">Payment Method *</label>
              <select
                id="payment_method"
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                className={errors.payment_method ? 'input input-error' : 'input'}
              >
                <option value="">Select payment method</option>
                {PAYMENT_METHODS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.payment_method && <span className="field-error">{errors.payment_method}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={errors.description ? 'input input-error' : 'input'}
              rows="4"
              maxLength="1000"
              placeholder="Optional notes (max 1000 characters)"
            />
            <span className="char-count">{form.description.length}/1000</span>
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-actions">
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : mode === 'edit' ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;
