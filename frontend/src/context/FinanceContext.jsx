import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const FinanceContext = createContext(null);

export const FinanceProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [categories, setCategories] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Custom states that can be configured inside Profile Settings
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('spendwise_currency');
    // Default to Indian Rupees and migrate any stored default dollar symbols
    if (!saved || saved === '$') {
      return '₹';
    }
    return saved;
  });
  const [budgetLimit, setBudgetLimit] = useState(parseFloat(localStorage.getItem('spendwise_budget_limit')) || 30000.0);

  // Sync settings when loaded
  useEffect(() => {
    localStorage.setItem('spendwise_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('spendwise_budget_limit', budgetLimit);
  }, [budgetLimit]);

  // Load finance summary dashboard
  const fetchDashboard = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await api.get('/api/analytics/summary');
      setSummary(res.data.summary);
      setCategories(res.data.categories);
      setRecentTransactions(res.data.recentTransactions);
      setInsights(res.data.insights);
    } catch (err) {
      console.error('Failed to load summary stats', err);
    } finally {
      setLoading(false);
    }
  };

  // Load historical month trends
  const fetchMonthlyTrends = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/api/analytics/monthly');
      setMonthlyTrends(res.data);
    } catch (err) {
      console.error('Failed to load monthly trends', err);
    }
  };

  // Run initial sync on sign-in
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboard();
      fetchMonthlyTrends();
    } else {
      setExpenses([]);
      setIncomes([]);
      setSummary({ totalIncome: 0, totalExpenses: 0, balance: 0 });
      setCategories([]);
      setRecentTransactions([]);
      setInsights([]);
      setMonthlyTrends([]);
    }
  }, [isAuthenticated]);

  // Fetch paginated/filtered Expenses
  const getExpensesList = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/api/expenses', { params });
      setExpenses(res.data.expenses);
      return res.data; // Returns total, page count for UI pagination controls
    } catch (err) {
      console.error('Failed to fetch expenses list', err);
      return { expenses: [], total: 0, pages: 1 };
    } finally {
      setLoading(false);
    }
  };

  // Create Expense
  const addExpense = async (data) => {
    try {
      const res = await api.post('/api/expenses', data);
      // Reactive updates
      fetchDashboard();
      fetchMonthlyTrends();
      return { success: true, expense: res.data.expense };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to add expense' };
    }
  };

  // Edit Expense
  const editExpense = async (id, data) => {
    try {
      const res = await api.put(`/api/expenses/${id}`, data);
      fetchDashboard();
      fetchMonthlyTrends();
      return { success: true, expense: res.data.expense };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to edit expense' };
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await api.delete(`/api/expenses/${id}`);
      fetchDashboard();
      fetchMonthlyTrends();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete expense' };
    }
  };

  // Fetch paginated/filtered Incomes
  const getIncomesList = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/api/income', { params });
      setIncomes(res.data.incomes);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch incomes list', err);
      return { incomes: [], total: 0, pages: 1 };
    } finally {
      setLoading(false);
    }
  };

  // Create Income
  const addIncome = async (data) => {
    try {
      const res = await api.post('/api/income', data);
      fetchDashboard();
      fetchMonthlyTrends();
      return { success: true, income: res.data.income };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to add income record' };
    }
  };

  // Edit Income
  const editIncome = async (id, data) => {
    try {
      const res = await api.put(`/api/income/${id}`, data);
      fetchDashboard();
      fetchMonthlyTrends();
      return { success: true, income: res.data.income };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to edit income record' };
    }
  };

  // Delete Income
  const deleteIncome = async (id) => {
    try {
      await api.delete(`/api/income/${id}`);
      fetchDashboard();
      fetchMonthlyTrends();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete income record' };
    }
  };

  // Trigger Excel/CSV Download
  const downloadCSVReport = async () => {
    try {
      const response = await api.get('/api/analytics/export/csv', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `SpendWise_Report_${new Date().toISOString().slice(0,10)}.csv`;
      link.click();
    } catch (err) {
      console.error('Failed to download CSV statement', err);
    }
  };

  // Trigger PDF Statement Download
  const downloadPDFReport = async () => {
    try {
      const response = await api.get('/api/analytics/export/pdf', { params: { currency }, responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `SpendWise_Report_${new Date().toISOString().slice(0,10)}.pdf`;
      link.click();
    } catch (err) {
      console.error('Failed to download PDF statement', err);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        expenses,
        incomes,
        summary,
        categories,
        recentTransactions,
        insights,
        monthlyTrends,
        loading,
        currency,
        budgetLimit,
        setCurrency,
        setBudgetLimit,
        fetchDashboard,
        fetchMonthlyTrends,
        getExpensesList,
        addExpense,
        editExpense,
        deleteExpense,
        getIncomesList,
        addIncome,
        editIncome,
        deleteIncome,
        downloadCSVReport,
        downloadPDFReport
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be wrapped within a FinanceProvider');
  }
  return context;
};
