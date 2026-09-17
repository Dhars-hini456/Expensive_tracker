import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_ICONS } from '../constants';

function ExpenseList({ expenses, onDeleteRequest }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="card">
        <p className="empty-text">No expenses found. Try adjusting your filters, or add a new expense.</p>
      </div>
    );
  }

  return (
    <div className="card table-card">
      <div className="table-responsive">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td>
                  <Link to={`/expense/${exp.id}`} className="expense-title-link">
                    {exp.title}
                  </Link>
                </td>
                <td>
                  <span className="category-badge">
                    {CATEGORY_ICONS[exp.category] || '📦'} {exp.category}
                  </span>
                </td>
                <td className="amount-cell">₹{Number(exp.amount).toFixed(2)}</td>
                <td>{exp.date}</td>
                <td>{exp.payment_method}</td>
                <td className="actions-cell">
                  <Link to={`/expense/${exp.id}`} className="btn btn-sm btn-outline">
                    View
                  </Link>
                  <Link to={`/edit/${exp.id}`} className="btn btn-sm btn-outline">
                    Edit
                  </Link>
                  <button className="btn btn-sm btn-danger" onClick={() => onDeleteRequest(exp)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseList;
