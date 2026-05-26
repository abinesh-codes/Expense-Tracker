import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useFinance } from '../context/FinanceContext';

const ExpenseModal = ({ isOpen, onClose, onSubmit, expense = null }) => {
  const { currency } = useFinance();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Hydrate form when editing an existing expense item
  useEffect(() => {
    if (expense) {
      setTitle(expense.title || '');
      setAmount(expense.amount || '');
      setCategory(expense.category || 'Food');
      setDate(expense.date || new Date().toISOString().slice(0, 10));
      setDescription(expense.description || '');
    } else {
      // Reset form fields
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(new Date().toISOString().slice(0, 10));
      setDescription('');
    }
    setError('');
  }, [expense, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) return setError('Please enter a description title.');
    if (!amount || parseFloat(amount) <= 0) return setError('Please enter a valid positive amount.');
    if (!category) return setError('Please select an expense category.');

    const payload = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date,
      description: description.trim()
    };

    const res = await onSubmit(payload);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to submit transaction.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-fade-in" style={{ padding: 0 }}>
        <div style={styles.header}>
          <h3 style={styles.title}>{expense ? 'Edit Expense' : 'Add Expense'} 💸</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            <IoCloseOutline />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.errorAlert}>{error}</div>}

          <div className="form-group">
            <label className="form-label">Expense Title</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Grocery Shop, Electricity Bill"
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Amount ({currency})</label>
              <input 
                type="number" 
                step="0.01" 
                className="form-input" 
                placeholder="0.00"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                required 
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category</label>
              <select 
                className="form-input form-select" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Transaction Date</label>
            <input 
              type="date" 
              className="form-input" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea 
              className="form-input" 
              placeholder="Add extra details..."
              style={{ minHeight: '80px', resize: 'vertical' }}
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
              {expense ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border-glass)',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  form: {
    padding: '1.5rem',
  },
  row: {
    display: 'flex',
    gap: '1rem',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid var(--color-danger)',
    borderRadius: '10px',
    color: 'var(--color-danger)',
    fontSize: '0.85rem',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    fontWeight: '500',
  }
};

export default ExpenseModal;
