import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import Toast from '../components/Toast';
import ExpenseModal from '../components/ExpenseModal';
import IncomeModal from '../components/IncomeModal';
import { 
  IoSearchOutline, 
  IoFunnelOutline, 
  IoSwapVerticalOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoTrendingUpOutline,
  IoTrendingDownOutline,
  IoChevronBack,
  IoChevronForward,
  IoWalletOutline
} from 'react-icons/io5';

const Transactions = () => {
  const { 
    getExpensesList, 
    getIncomesList, 
    editExpense, 
    deleteExpense, 
    editIncome, 
    deleteIncome, 
    currency 
  } = useFinance();

  // Filters & Sorting States
  const [txType, setTxType] = useState('All'); // All, Expense, Income
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // List arrays
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Edit states
  const [editingItem, setEditingItem] = useState(null);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);

  // Auto-fetch listings on filter adjustments
  useEffect(() => {
    fetchList();
  }, [txType, category, sortBy, order, page]);

  // Handle typing search with a small delay
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchList();
    }, 450);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchList = async () => {
    setLoading(true);
    try {
      const params = {
        search: search.trim(),
        sortBy,
        order,
        page,
        limit: 10
      };

      if (category !== 'All') {
        params.category = category;
        params.source = category;
      }

      if (txType === 'Expense') {
        const data = await getExpensesList(params);
        setTransactions(data.expenses.map(e => ({ ...e, type: 'expense' })));
        setTotalPages(data.pages || 1);
      } else if (txType === 'Income') {
        const data = await getIncomesList(params);
        setTransactions(data.incomes.map(i => ({ ...i, type: 'income', title: i.source, category: 'Income' })));
        setTotalPages(data.pages || 1);
      } else {
        // Fetch both and merge client-side for "All" combined view
        const expParams = { ...params, limit: 30 };
        const incParams = { ...params, limit: 30 };
        
        const [expData, incData] = await Promise.all([
          getExpensesList(expParams),
          getIncomesList(incParams)
        ]);

        const merged = [
          ...expData.expenses.map(e => ({ ...e, type: 'expense' })),
          ...incData.incomes.map(i => ({ ...i, type: 'income', title: i.source, category: 'Income' }))
        ];

        // Sort merged list client side
        const sorted = merged.sort((a, b) => {
          let compare = 0;
          if (sortBy === 'amount') {
            compare = a.amount - b.amount;
          } else {
            compare = new Date(a.date).getTime() - new Date(b.date).getTime();
          }
          return order === 'desc' ? -compare : compare;
        });

        // Simple client pagination for merged view
        const limit = 10;
        const total = sorted.length;
        const paged = sorted.slice((page - 1) * limit, page * limit);
        
        setTransactions(paged);
        setTotalPages(Math.max(Math.ceil(total / limit), 1));
      }
    } catch (err) {
      console.error('Failed to load transaction history', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    if (item.type === 'expense') {
      setExpenseModalOpen(true);
    } else {
      setIncomeModalOpen(true);
    }
  };

  const handleDeleteClick = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    
    let res;
    if (item.type === 'expense') {
      res = await deleteExpense(item.id);
    } else {
      res = await deleteIncome(item.id);
    }

    if (res.success) {
      showToast('Transaction successfully deleted.', 'success');
      fetchList();
    } else {
      showToast(res.error || 'Failed to delete transaction.', 'error');
    }
  };

  const handleExpenseEditSubmit = async (payload) => {
    const res = await editExpense(editingItem.id, payload);
    if (res.success) {
      showToast('Expense updated successfully!', 'success');
      fetchList();
      return { success: true };
    }
    return res;
  };

  const handleIncomeEditSubmit = async (payload) => {
    const res = await editIncome(editingItem.id, payload);
    if (res.success) {
      showToast('Income updated successfully!', 'success');
      fetchList();
      return { success: true };
    }
    return res;
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Toast Alert */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Top Ledger Headers */}
      <div style={styles.header}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
            Financial Ledger
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Audit, filter, edit, or remove expense and income cash flows.
          </p>
        </div>
      </div>

      {/* Advanced Filters Section */}
      <section className="glass-card" style={styles.filterCard}>
        <div style={styles.filterRow}>
          {/* Unified search bar */}
          <div style={styles.searchBox}>
            <IoSearchOutline style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by title, source or notes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Transaction Type tab buttons */}
          <div style={styles.typeSelector}>
            {['All', 'Expense', 'Income'].map((t) => (
              <button 
                key={t}
                onClick={() => { setTxType(t); setCategory('All'); setPage(1); }}
                style={{
                  ...styles.typeBtn,
                  background: txType === t ? 'var(--color-primary)' : 'transparent',
                  color: txType === t ? 'white' : 'var(--text-secondary)'
                }}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>

        <div style={styles.filterRow}>
          {/* Category drop down selector */}
          <div style={styles.dropdownBox}>
            <IoFunnelOutline style={styles.selectIcon} />
            <select 
              value={category} 
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              style={styles.selectInput}
            >
              <option value="All">All Categories</option>
              {txType !== 'Income' && (
                <>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health">Health</option>
                  <option value="Others">Others</option>
                </>
              )}
              {txType !== 'Expense' && (
                <>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Investments">Investments</option>
                  <option value="Gift">Gift</option>
                  <option value="Others">Others</option>
                </>
              )}
            </select>
          </div>

          {/* Sort By selector */}
          <div style={styles.dropdownBox}>
            <IoSwapVerticalOutline style={styles.selectIcon} />
            <select 
              value={`${sortBy}-${order}`} 
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortBy(field);
                setOrder(direction);
                setPage(1);
              }}
              style={styles.selectInput}
            >
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Ledger List */}
      <section className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeadRow}>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Title / Source</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Amount</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={styles.tableRow}>
                    <td style={styles.td}><div className="skeleton" style={{ height: '16px', width: '80px' }} /></td>
                    <td style={styles.td}><div className="skeleton" style={{ height: '16px', width: '60px' }} /></td>
                    <td style={styles.td}><div className="skeleton" style={{ height: '16px', width: '150px' }} /></td>
                    <td style={styles.td}><div className="skeleton" style={{ height: '16px', width: '70px' }} /></td>
                    <td style={styles.td}><div className="skeleton" style={{ height: '16px', width: '60px' }} /></td>
                    <td style={styles.td}><div className="skeleton" style={{ height: '24px', width: '80px', margin: '0 auto' }} /></td>
                  </tr>
                ))
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} style={styles.tableRow}>
                    <td style={styles.td}>{tx.date}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: tx.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: tx.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)'
                      }}>
                        {tx.type === 'income' ? <IoTrendingUpOutline /> : <IoTrendingDownOutline />}
                        <span>{tx.type}</span>
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: '700' }}>{tx.title}</td>
                    <td style={styles.td}>{tx.category}</td>
                    <td style={{
                      ...styles.td,
                      fontWeight: '800',
                      fontFamily: 'var(--font-display)',
                      color: tx.type === 'income' ? 'var(--color-success)' : 'var(--text-primary)'
                    }}>
                      {tx.type === 'income' ? '+' : '-'}{currency}{tx.amount.toFixed(2)}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <div style={styles.actionsBox}>
                        <button onClick={() => handleEditClick(tx)} style={styles.actionBtn} title="Edit Item">
                          <IoPencilOutline style={{ color: 'var(--color-primary)' }} />
                        </button>
                        <button onClick={() => handleDeleteClick(tx)} style={styles.actionBtn} title="Delete Item">
                          <IoTrashOutline style={{ color: 'var(--color-danger)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={styles.tableEmpty}>
                    <IoWalletOutline style={{ fontSize: '3rem', color: 'var(--text-tertiary)', opacity: 0.4, marginBottom: '0.75rem' }} />
                    <h4 style={{ fontWeight: '700' }}>No Transactions Found</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Modify search query or create transaction items.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button 
              onClick={() => setPage(p => Math.max(p - 1, 1))} 
              disabled={page === 1}
              style={{ ...styles.pagBtn, opacity: page === 1 ? 0.4 : 1 }}
            >
              <IoChevronBack />
              <span>Prev</span>
            </button>
            <span style={styles.pagText}>Page <b>{page}</b> of <b>{totalPages}</b></span>
            <button 
              onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
              disabled={page === totalPages}
              style={{ ...styles.pagBtn, opacity: page === totalPages ? 0.4 : 1 }}
            >
              <span>Next</span>
              <IoChevronForward />
            </button>
          </div>
        )}
      </section>

      {/* Editing Overlays */}
      <ExpenseModal 
        isOpen={expenseModalOpen} 
        onClose={() => { setExpenseModalOpen(false); setEditingItem(null); }} 
        onSubmit={handleExpenseEditSubmit} 
        expense={editingItem}
      />

      <IncomeModal 
        isOpen={incomeModalOpen} 
        onClose={() => { setIncomeModalOpen(false); setEditingItem(null); }} 
        onSubmit={handleIncomeEditSubmit} 
        income={editingItem}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    width: '100%',
  },
  searchBox: {
    flex: 2,
    minWidth: '260px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    fontSize: '1.2rem',
    color: 'var(--text-secondary)',
  },
  searchInput: {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--border-glass)',
    borderRadius: '12px',
    padding: '0.8rem 1rem 0.8rem 2.75rem',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '0.9rem',
  },
  typeSelector: {
    flex: 1,
    minWidth: '220px',
    display: 'flex',
    background: 'var(--input-bg)',
    border: '1px solid var(--border-glass)',
    borderRadius: '12px',
    padding: '0.25rem',
  },
  typeBtn: {
    flex: 1,
    border: 'none',
    padding: '0.55rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background var(--transition-fast), color var(--transition-fast)',
    fontFamily: 'var(--font-display)',
  },
  dropdownBox: {
    flex: 1,
    minWidth: '180px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  selectIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-secondary)',
    pointerEvents: 'none',
  },
  selectInput: {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--border-glass)',
    borderRadius: '12px',
    padding: '0.8rem 1rem 0.8rem 2.5rem',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    backgroundSize: '1.1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeadRow: {
    background: 'rgba(255, 255, 255, 0.02)',
    borderBottom: '1px solid var(--border-glass)',
  },
  th: {
    padding: '1rem 1.5rem',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-display)',
  },
  tableRow: {
    borderBottom: '1px solid var(--border-glass)',
  },
  td: {
    padding: '1rem 1.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    verticalAlign: 'middle',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.65rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  actionsBox: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.65rem',
  },
  actionBtn: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-glass)',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background var(--transition-fast)',
  },
  tableEmpty: {
    textAlign: 'center',
    padding: '4rem 1.5rem',
    color: 'var(--text-secondary)',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.01)',
  },
  pagBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'var(--bg-surface-solid)',
    border: '1px solid var(--border-glass)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
  },
  pagText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  }
};

export default Transactions;
