import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseDetail from './components/ExpenseDetail';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<ExpenseForm mode="add" />} />
              <Route path="/edit/:id" element={<ExpenseForm mode="edit" />} />
              <Route path="/expense/:id" element={<ExpenseDetail />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
          <footer className="app-footer">
            Expense Tracker &copy; 2026 &mdash; Built with React &amp; Django REST Framework
          </footer>
        </div>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
