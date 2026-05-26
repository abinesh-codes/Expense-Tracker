import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
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
  IoDocumentTextOutline, 
  IoDownloadOutline, 
  IoSparklesOutline, 
  IoTrendingUp, 
  IoTrendingDown,
  IoPieChartOutline
} from 'react-icons/io5';

const CATEGORY_COLORS = {
  Food: '#38bdf8',
  Travel: '#a78bfa',
  Shopping: '#fb7185',
  Bills: '#f59e0b',
  Entertainment: '#ec4899',
  Health: '#10b981',
  Others: '#94a3b8'
};

const Analytics = () => {
  const { 
    monthlyTrends, 
    categories, 
    insights, 
    currency, 
    downloadCSVReport, 
    downloadPDFReport 
  } = useFinance();

  const hasExpenses = categories.some(c => c.value > 0);

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Top action header bar */}
      <div style={styles.header}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
            Financial Insights & Reports
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Examine category breakdowns, historical bars, and export formal statements.
          </p>
        </div>

        <div style={styles.actionButtons}>
          <button onClick={downloadCSVReport} className="btn btn-secondary btn-sm" style={styles.btnSm}>
            <IoDownloadOutline />
            <span>Export CSV</span>
          </button>
          
          <button onClick={downloadPDFReport} className="btn btn-primary btn-sm" style={styles.btnSm}>
            <IoDocumentTextOutline />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* AI Spending Advisor glowing card */}
      <section className="glass-card" style={styles.insightCard}>
        <div style={styles.insightHeader}>
          <IoSparklesOutline style={{ color: 'var(--color-purple)', fontSize: '1.4rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
            SpendWise Smart AI Spending Recommendations
          </h3>
        </div>
        <div style={styles.insightList}>
          {insights.map((tip, index) => {
            // Check for emoji codes to parse spacing or layout beautifully
            return (
              <div key={index} style={styles.insightRow} className="insight-bullet">
                <span style={styles.insightTipText}>{tip}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Charts Grid */}
      <section style={styles.chartsGrid}>
        {/* Monthly comparative bars */}
        <div className="glass-card" style={{ flex: 1.5, minWidth: '320px' }}>
          <h3 style={styles.chartTitle}>Month-over-Month Cash Flows</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="monthName" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ 
                    background: 'var(--bg-surface-solid)', 
                    borderColor: 'var(--border-glass-hover)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)'
                  }} 
                />
                <Bar dataKey="income" name="Income" fill="var(--color-success)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" name="Expense" fill="var(--color-danger)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Category distribution lists */}
        <div className="glass-card" style={{ flex: 1, minWidth: '300px' }}>
          <h3 style={styles.chartTitle}>Spending Allocations</h3>
          {hasExpenses ? (
            <div style={styles.allocList}>
              {categories.filter(c => c.value > 0).map((cat) => (
                <div key={cat.name} style={styles.allocRow}>
                  <div style={styles.allocMeta}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ ...styles.allocDot, background: CATEGORY_COLORS[cat.name] }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{cat.name}</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {cat.percentage.toFixed(1)}%  •  {currency}{cat.value.toFixed(2)}
                    </span>
                  </div>
                  <div style={styles.allocBarBg}>
                    <div style={{ 
                      ...styles.allocBarFill, 
                      width: `${cat.percentage}%`,
                      background: CATEGORY_COLORS[cat.name] 
                    }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyContainer}>
              <IoPieChartOutline style={{ fontSize: '3rem', color: 'var(--text-tertiary)', opacity: 0.4, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No expense data to analyze allocation ratios.</p>
            </div>
          )}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .insight-bullet {
          border-left: 2px solid var(--border-glass);
          padding-left: 1rem;
          transition: border var(--transition-fast);
        }
        .insight-bullet:hover {
          border-color: var(--color-purple);
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
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  btnSm: {
    padding: '0.65rem 1.15rem',
    fontSize: '0.85rem',
  },
  insightCard: {
    borderLeft: '4px solid var(--color-purple)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(0,0,0,0) 100%)',
  },
  insightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
  },
  insightList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  insightRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  insightTipText: {
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: 'var(--text-primary)',
  },
  chartsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  chartTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    marginBottom: '1.5rem',
  },
  allocList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  allocRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  allocMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  allocDot: {
    width: '8px',
    height: '8px',
    borderRadius: '99px',
  },
  allocBarBg: {
    width: '100%',
    height: '6px',
    background: 'var(--border-glass)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  allocBarFill: {
    height: '100%',
    borderRadius: '10px',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '240px',
    textAlign: 'center',
  }
};

export default Analytics;
