import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getExpenses = (params) => apiClient.get('/expenses/', { params });
export const getExpense = (id) => apiClient.get(`/expenses/${id}/`);
export const createExpense = (data) => apiClient.post('/expenses/', data);
export const updateExpense = (id, data) => apiClient.put(`/expenses/${id}/`, data);
export const deleteExpense = (id) => apiClient.delete(`/expenses/${id}/`);
export const getSummary = (params) => apiClient.get('/expenses/summary/', { params });
export const getCategories = () => apiClient.get('/expenses/categories/');
export const getPaymentMethods = () => apiClient.get('/expenses/payment_methods/');

export default apiClient;
