import React from 'react';

function DeleteConfirmModal({ expense, onCancel, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Delete Expense</h3>
        <p>
          Are you sure you want to delete <strong>&ldquo;{expense.title}&rdquo;</strong> (₹
          {Number(expense.amount).toFixed(2)})? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
