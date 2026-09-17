import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          💰 Expense Tracker
        </Link>
        <nav className="navbar-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link to="/add" className={location.pathname === '/add' ? 'active' : ''}>
            + Add Expense
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
