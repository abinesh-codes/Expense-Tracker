import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Toast from '../components/Toast';
import ExpenseModal from '../components/ExpenseModal';
import IncomeModal from '../components/IncomeModal';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  IoTrendingUp, 
  IoTrendingDown, 
  IoWallet, 
  IoAdd, 
  IoWarning, 
  IoArrowForward,
  IoFastFoodOutline,
  IoCarOutline,
  IoCartOutline,
  IoReceiptOutline,
  IoFilmOutline,
  IoPulseOutline,
  IoHelpCircleOutline,
  IoCheckmarkDoneCircleOutline
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

// Colors for Category Donut Chart
const CATEGORY_COLORS = {
  Food: '#38bdf8',          // Cyan
  Travel: '#a78bfa',        // Amethyst Purple
  Shopping: '#fb7185',      // Hot Rose
  Bills: '#f59e0b',         // Orange
  Entertainment: '#ec4899', // Pink
  Health: '#10b981',        // Emerald Green
  Others: '#94a3b8'         // Slate Gray
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    summary, 
    categories, 
    recentTransactions, 
    monthlyTrends, 
    currency, 
    budgetLimit,
    addExpense,
    addIncome
  } = useFinance();

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Math variables
  const totalInc = summary.totalIncome || 0.0;
  const totalExp = summary.totalExpenses || 0.0;
  const netBal = summary.balance || 0.0;
  
  // Calculate budget threshold percentage
  const budgetPercentage = Math.min((totalExp / budgetLimit) * 100, 100);
  const isOverBudget = totalExp >= budgetLimit;
  const isNearBudget = !isOverBudget && (totalExp / budgetLimit) >= 0.85;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleExpenseSubmit = async (payload) => {
    const res = await addExpense(payload);
    if (res.success) {
      showToast('Expense transaction added successfully!', 'success');
      return { success: true };
    }
    return res;
  };

  const handleIncomeSubmit = async (payload) => {
    const res = await addIncome(payload);
    if (res.success) {
      showToast('Income record added successfully!', 'success');
      return { success: true };
    }
    return res;
  };

  // Helper to resolve transaction category icon
  const getTransactionIcon = (cat, type) => {
    if (type === 'income') return <IoTrendingUp style={{ color: 'var(--color-success)' }} />;
    switch (cat) {
      case 'Food': return <IoFastFoodOutline />;
      case 'Travel': return <IoCarOutline />;
      case 'Shopping': return <IoCartOutline />;
      case 'Bills': return <IoReceiptOutline />;
      case 'Entertainment': return <IoFilmOutline />;
      case 'Health': return <IoPulseOutline />;
      default: return <IoHelpCircleOutline />;
    }
  };

  // Helper to verify if pie chart has any data
  const hasExpenses = categories.some(c => c.value > 0);

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Toast Alert popup */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Welcome & Quick Summary Cards Grid */}
      <section style={styles.gridCards}>
        {/* Income Card */}
        <div className="glass-card" style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>Total Income</span>
            <div style={{ ...styles.cardIconBox, background: 'rgba(16, 185, 129, 0.1)' }}>
              <IoTrendingUp style={{ color: 'var(--color-success)', fontSize: '1.25rem' }} />
            </div>
          </div>
          <span style={styles.cardVal} className="text-gradient">
            {currency}{totalInc.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span style={{ ...styles.cardFooter, color: 'var(--color-success)' }}>
            + Monthly Growth active
          </span>
        </div>

        {/* Expenses Card */}
        <div className="glass-card" style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>Total Expenses</span>
            <div style={{ ...styles.cardIconBox, background: 'rgba(239, 68, 68, 0.1)' }}>
              <IoTrendingDown style={{ color: 'var(--color-danger)', fontSize: '1.25rem' }} />
            </div>
          </div>
          <span style={styles.cardVal}>
            {currency}{totalExp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span style={styles.cardFooter}>
            Cap Limit: {currency}{budgetLimit.toLocaleString()}
          </span>
        </div>

        {/* Net Balance Card */}
        <div className="glass-card" style={{ ...styles.card, borderLeft: `3px solid ${netBal >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}` }}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>Net Balance</span>
            <div style={{ ...styles.cardIconBox, background: 'rgba(59, 130, 246, 0.1)' }}>
              <IoWallet style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }} />
            </div>
          </div>
          <span style={{ ...styles.cardVal, color: netBal >= 0 ? 'var(--text-primary)' : 'var(--color-danger)' }}>
            {netBal < 0 ? '-' : ''}{currency}{Math.abs(netBal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span style={styles.cardFooter}>
            Cash buffer status
          </span>
        </div>
      </section>

      {/* Budget warnings if configured limits exceeded */}
      {(isOverBudget || isNearBudget) && (
        <section className="glass-card animate-fade-in" style={{ ...styles.budgetWarning, borderLeft: `4px solid ${isOverBudget ? 'var(--color-danger)' : 'var(--color-warning)'}` }}>
          <IoWarning style={{ color: isOverBudget ? 'var(--color-danger)' : 'var(--color-warning)', fontSize: '1.8rem' }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.15rem' }}>
              {isOverBudget ? 'Budget Limit Exceeded!' : 'Approaching Monthly Budget Cap'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              You have spent <b>{budgetPercentage.toFixed(0)}%</b> of your monthly budget limit of {currency}{budgetLimit.toLocaleString()}.
            </p>
            <div style={styles.progressBarContainer}>
              <div style={{ 
                ...styles.progressBarFill, 
                width: `${budgetPercentage}%`,
                background: isOverBudget ? 'var(--color-danger)' : 'var(--color-warning)'
              }} />
            </div>
          </div>
        </section>
      )}

      {/* Charts Grid */}
      <section style={styles.gridCharts}>
        {/* Trend Area Chart */}
        <div className="glass-card" style={{ ...styles.chartCard, flex: 2 }}>
          <h3 style={styles.sectionTitle}>Finance Trajectory</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-danger)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--color-danger)" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="monthName" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-surface-solid)', 
                    borderColor: 'var(--border-glass-hover)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)'
                  }} 
                />
                <Area type="monotone" dataKey="income" name="Income" stroke="var(--color-success)" strokeWidth={2} fillOpacity={1} fill="url(#colorInc)" />
                <Area type="monotone" dataKey="expense" name="Expense" stroke="var(--color-danger)" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Categories breakdown Pie chart */}
        <div className="glass-card" style={{ ...styles.chartCard, flex: 1.2 }}>
          <h3 style={styles.sectionTitle}>Expenses by Category</h3>
          {hasExpenses ? (
            <div style={{ width: '100%', height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', height: 210 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories.filter(c => c.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categories.filter(c => c.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#ffffff'} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val) => [`${currency}${val.toFixed(2)}`, 'Spent']}
                      contentStyle={{ 
                        background: 'var(--bg-surface-solid)', 
                        borderColor: 'var(--border-glass-hover)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Custom Legend */}
              <div style={styles.legendContainer}>
                {categories.filter(c => c.value > 0).slice(0, 4).map((entry) => (
                  <div key={entry.name} style={styles.legendItem}>
                    <div style={{ ...styles.legendDot, background: CATEGORY_COLORS[entry.name] }} />
                    <span style={styles.legendLabel}>{entry.name} ({entry.percentage.toFixed(0)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={styles.chartEmpty}>
              <p>No discretionary expenses recorded yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent transactions grid */}
      <section style={styles.rowWrapper}>
        <div className="glass-card" style={{ width: '100%', flex: 1 }}>
          <div style={styles.rowHeader}>
            <h3 style={styles.sectionTitle}>Recent Transactions</h3>
            <button onClick={() => navigate('/transactions')} style={styles.btnLink}>
              <span>View All</span>
              <IoArrowForward />
            </button>
          </div>

          <div style={styles.txList}>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <div key={tx.id} style={styles.txRow} className="tx-hover-indicator">
                  <div style={styles.txLeft}>
                    <div style={{
                      ...styles.txIcon,
                      background: tx.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      color: tx.type === 'income' ? 'var(--color-success)' : 'var(--text-primary)'
                    }}>
                      {getTransactionIcon(tx.category, tx.type)}
                    </div>
                    <div style={styles.txMeta}>
                      <span style={styles.txTitle}>{tx.title}</span>
                      <span style={styles.txDate}>{tx.date}  •  {tx.category}</span>
                    </div>
                  </div>
                  <div style={styles.txRight}>
                    <span style={{
                      ...styles.txAmt,
                      color: tx.type === 'income' ? 'var(--color-success)' : 'var(--text-primary)'
                    }}>
                      {tx.type === 'income' ? '+' : '-'}{currency}{tx.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyStateContainer}>
                <IoCheckmarkDoneCircleOutline style={styles.emptyIcon} />
                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.2rem' }}>All Clear!</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No transactions recorded. Click the floating action button below to start.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Floating Action Button with Popup Add Options */}
      <div style={styles.fabWrapper}>
        {fabMenuOpen && (
          <div style={styles.fabMenu} className="glass-card animate-fade-in">
            <button 
              onClick={() => { setIncomeModalOpen(true); setFabMenuOpen(false); }} 
              className="btn btn-success" 
              style={styles.fabMenuItem}
            >
              <span>Add Income</span>
              <IoTrendingUp />
            </button>
            <button 
              onClick={() => { setExpenseModalOpen(true); setFabMenuOpen(false); }} 
              className="btn btn-primary" 
              style={styles.fabMenuItem}
            >
              <span>Add Expense</span>
              <IoTrendingDown />
            </button>
          </div>
        )}
        <button 
          className="fab" 
          onClick={() => setFabMenuOpen(!fabMenuOpen)}
          style={{ transform: fabMenuOpen ? 'rotate(45deg)' : 'none' }}
        >
          <IoAdd />
        </button>
      </div>

      {/* Overlays / Modals */}
      <ExpenseModal 
        isOpen={expenseModalOpen} 
        onClose={() => setExpenseModalOpen(false)} 
        onSubmit={handleExpenseSubmit} 
      />

      <IncomeModal 
        isOpen={incomeModalOpen} 
        onClose={() => setIncomeModalOpen(false)} 
        onSubmit={handleIncomeSubmit} 
      />

      <style dangerouslySetInnerHTML={{__html: `
        .tx-hover-indicator {
          transition: background var(--transition-fast);
        }
        .tx-hover-indicator:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
        body[data-theme='light'] .tx-hover-indicator:hover {
          background: rgba(15, 23, 42, 0.02) !important;
        }
      `}} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
    width: '100%',
    position: 'relative',
    paddingBottom: '4rem',
  },
  gridCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.25rem',
    width: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-display)',
  },
  cardIconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardVal: {
    fontSize: '2rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
  },
  cardFooter: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    fontWeight: '500',
  },
  budgetWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    background: 'rgba(245, 158, 11, 0.05)',
    padding: '1.25rem',
    borderRadius: '16px',
  },
  progressBarContainer: {
    width: '100%',
    height: '6px',
    background: 'var(--border-glass)',
    borderRadius: '10px',
    marginTop: '0.5rem',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width var(--transition-normal) ease-out',
  },
  gridCharts: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.25rem',
  },
  chartCard: {
    minWidth: '300px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    marginBottom: '1.25rem',
  },
  legendContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '99px',
  },
  legendLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  chartEmpty: {
    height: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  rowWrapper: {
    display: 'flex',
    gap: '1.25rem',
  },
  rowHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  btnLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: 'none',
    border: 'none',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
  },
  txList: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  txRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.85rem 0.5rem',
    borderRadius: '12px',
    borderBottom: '1px solid var(--border-glass)',
  },
  txLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
  },
  txIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.15rem',
  },
  txMeta: {
    display: 'flex',
    flexDirection: 'column',
  },
  txTitle: {
    fontWeight: '700',
    fontSize: '0.95rem',
  },
  txDate: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
  },
  txRight: {
    textAlign: 'right',
  },
  txAmt: {
    fontWeight: '700',
    fontSize: '1rem',
    fontFamily: 'var(--font-display)',
  },
  emptyStateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2.5rem 1rem',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '3rem',
    color: 'var(--text-tertiary)',
    opacity: 0.4,
    marginBottom: '0.75rem',
  },
  fabWrapper: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.75rem',
  },
  fabMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '0.5rem',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
    background: 'var(--bg-surface-solid)',
  },
  fabMenuItem: {
    padding: '0.65rem 1rem',
    fontSize: '0.85rem',
    minWidth: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
};

export default Dashboard;
