import React from 'react';
import { CATEGORY_ICONS } from '../constants';

function CategorySummary({ categorySummary }) {
  if (!categorySummary || categorySummary.length === 0) {
    return (
      <div className="card category-summary">
        <h2>Category-wise Summary</h2>
        <p className="empty-text">No data yet. Add an expense to see the breakdown.</p>
      </div>
    );
  }

  const maxTotal = Math.max(...categorySummary.map((c) => Number(c.total)));

  return (
    <div className="card category-summary">
      <h2>Category-wise Summary</h2>
      <div className="category-bars">
        {categorySummary.map((cat) => (
          <div className="category-bar-row" key={cat.category}>
            <div className="category-bar-label">
              <span>
                {CATEGORY_ICONS[cat.category] || '📦'} {cat.category}
              </span>
              <span>
                ₹{Number(cat.total).toFixed(2)} ({cat.count})
              </span>
            </div>
            <div className="category-bar-track">
              <div
                className="category-bar-fill"
                style={{ width: `${maxTotal > 0 ? (Number(cat.total) / maxTotal) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategorySummary;
