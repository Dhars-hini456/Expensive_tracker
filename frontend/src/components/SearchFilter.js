import React from 'react';
import { CATEGORIES } from '../constants';

function SearchFilter({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({ search: '', category: '', date_from: '', date_to: '', ordering: '-date' });
  };

  return (
    <div className="card search-filter">
      <div className="filter-row">
        <input
          type="text"
          name="search"
          placeholder="🔍 Search by title or description..."
          value={filters.search}
          onChange={handleChange}
          className="input search-input"
        />
        <select name="category" value={filters.category} onChange={handleChange} className="input">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date_from"
          value={filters.date_from}
          onChange={handleChange}
          className="input"
          title="From date"
        />
        <input
          type="date"
          name="date_to"
          value={filters.date_to}
          onChange={handleChange}
          className="input"
          title="To date"
        />
        <select name="ordering" value={filters.ordering} onChange={handleChange} className="input">
          <option value="-date">Newest First</option>
          <option value="date">Oldest First</option>
          <option value="-amount">Amount: High to Low</option>
          <option value="amount">Amount: Low to High</option>
        </select>
        <button type="button" className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default SearchFilter;
