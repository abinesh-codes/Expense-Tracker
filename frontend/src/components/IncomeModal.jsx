import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useFinance } from '../context/FinanceContext';

const IncomeModal = ({ isOpen, onClose, onSubmit, income = null }) => {
  const { currency } = useFinance();
  const [source, setSource] = useState('Salary');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Hydrate fields when editing an existing income record
  useEffect(() => {
    if (income) {
      setSource(income.source || 'Salary');
      setAmount(income.amount || '');
      setDate(income.date || new Date().toISOString().slice(0, 10));
      setDescription(income.description || '');
    } else {
      // Reset form fields
      setSource('Salary');
      setAmount('');
      setDate(new Date().toISOString().slice(0, 10));
      setDescription('');
    }
    setError('');
  }, [income, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!source) return setError('Please specify the income source type.');
    if (!amount || parseFloat(amount) <= 0) return setError('Please enter a valid positive amount.');

    const payload = {
      source,
      amount: parseFloat(amount),
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
          <h3 style={styles.title}>{income ? 'Edit Income Record' : 'Add Income Record'} 📈</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            <IoCloseOutline />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.errorAlert}>{error}</div>}

          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1.2 }}>
              <label className="form-label">Income Source</label>
              <select 
                className="form-input form-select" 
                value={source} 
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investments">Investments</option>
                <option value="Gift">Gift</option>
                <option value="Others">Others</option>
              </select>
            </div>

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
            <button type="submit" className="btn btn-success" style={{ flex: 2 }}>
              {income ? 'Save Changes' : 'Add Income'}
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

export default IncomeModal;
