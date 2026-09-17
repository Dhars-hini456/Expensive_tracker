import React from 'react';

function SummaryCards({ summary }) {
  const totalAmount = Number(summary.total_amount) || 0;
  const totalCount = Number(summary.total_count) || 0;
  const avg = totalCount > 0 ? totalAmount / totalCount : 0;
  const categoriesUsed = (summary.category_summary || []).length;

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <span className="summary-icon">💵</span>
        <div>
          <span className="summary-label">Total Expenses</span>
          <span className="summary-value">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>
      <div className="summary-card">
        <span className="summary-icon">🧾</span>
        <div>
          <span className="summary-label">Total Transactions</span>
          <span className="summary-value">{totalCount}</span>
        </div>
      </div>
      <div className="summary-card">
        <span className="summary-icon">📊</span>
        <div>
          <span className="summary-label">Average / Expense</span>
          <span className="summary-value">₹{avg.toFixed(2)}</span>
        </div>
      </div>
      <div className="summary-card">
        <span className="summary-icon">🏷️</span>
        <div>
          <span className="summary-label">Categories Used</span>
          <span className="summary-value">{categoriesUsed}</span>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
