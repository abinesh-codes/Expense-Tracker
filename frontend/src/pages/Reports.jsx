import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Toast from '../components/Toast';
import { 
  IoDocumentTextOutline, 
  IoCloudDownloadOutline, 
  IoPrintOutline, 
  IoAnalyticsOutline,
  IoCalendarOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';

const Reports = () => {
  const { 
    summary, 
    currency, 
    downloadCSVReport, 
    downloadPDFReport, 
    recentTransactions,
    loading 
  } = useFinance();

  const [toast, setToast] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCSVDownload = async () => {
    setDownloading(true);
    showToast('Preparing CSV report...', 'info');
    try {
      await downloadCSVReport();
      showToast('CSV statement downloaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to download CSV statement.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handlePDFDownload = async () => {
    setDownloading(true);
    showToast('Assembling PDF financial statement...', 'info');
    try {
      await downloadPDFReport();
      showToast('PDF statement generated and downloaded!', 'success');
    } catch (err) {
      showToast('Failed to generate PDF statement.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.container} className="animate-fade-in reports-wrapper">
      {/* Toast Alert */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Top Banner Header */}
      <div className="no-print">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
          Statements & Exports
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Analyze structured financial audits, print summary briefs, or download spreadsheet-ready CSV statements.
        </p>
      </div>

      <div style={styles.grid}>
        {/* Exporter Widgets Panel */}
        <div className="glass-card no-print" style={styles.exporterPanel}>
          <div style={styles.sectionHeader}>
            <IoCloudDownloadOutline style={{ fontSize: '1.35rem', color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
              Download Center
            </h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: '1.4' }}>
            Generate tax-compliant monthly transaction summaries in standard formats. The PDF includes dynamic aggregates and high-fidelity balance checks.
          </p>

          <div style={styles.buttonGroup}>
            <button 
              onClick={handlePDFDownload} 
              className="btn btn-primary" 
              style={{ width: '100%', height: '48px' }}
              disabled={downloading || loading}
            >
              <IoDocumentTextOutline />
              <span>Download PDF Statement</span>
            </button>

            <button 
              onClick={handleCSVDownload} 
              className="btn btn-secondary" 
              style={{ width: '100%', height: '48px', marginTop: '0.75rem' }}
              disabled={downloading || loading}
            >
              <IoCloudDownloadOutline />
              <span>Download Excel/CSV</span>
            </button>

            <button 
              onClick={handlePrint} 
              className="btn btn-secondary" 
              style={{ width: '100%', height: '48px', marginTop: '0.75rem' }}
              disabled={downloading || loading}
            >
              <IoPrintOutline />
              <span>Print Brief Overview</span>
            </button>
          </div>

          <div style={styles.infoAlert}>
            <IoAlertCircleOutline style={{ fontSize: '1.2rem', color: 'var(--color-primary)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <strong>Notice</strong>: Our PDF generation maps standard character sets. Dynamic conversions apply for local tax filings.
            </span>
          </div>
        </div>

        {/* Printable Preview Card */}
        <div className="glass-card print-preview-card" style={styles.previewPanel}>
          {/* Print Header */}
          <div className="print-only-header" style={{ display: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>SpendWise Statement</h1>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Generated on {new Date().toLocaleDateString()}</span>
              </div>
              <span style={{ fontSize: '1.5rem' }}>💸</span>
            </div>
          </div>

          <div style={styles.sectionHeader}>
            <IoAnalyticsOutline style={{ fontSize: '1.35rem', color: 'var(--color-success)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
              Financial Audit Summary
            </h3>
            <span className="badge-live-preview no-print">Live Preview</span>
          </div>

          {/* Quick Metrics grid */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricItem} className="metric-print-border">
              <span style={styles.metricLabel}>Total Inflow</span>
              <span style={{ ...styles.metricValue, color: 'var(--color-success)' }}>
                +{currency}{summary.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div style={styles.metricItem} className="metric-print-border">
              <span style={styles.metricLabel}>Total Outflow</span>
              <span style={{ ...styles.metricValue, color: 'var(--color-danger)' }}>
                -{currency}{summary.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div style={styles.metricItem} className="metric-print-border">
              <span style={styles.metricLabel}>Net Savings</span>
              <span style={{ ...styles.metricValue, color: summary.balance >= 0 ? 'var(--color-primary)' : 'var(--color-danger)' }}>
                {summary.balance >= 0 ? '+' : ''}
                {currency}{summary.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Mini Table flow */}
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IoCalendarOutline style={{ color: 'var(--text-tertiary)' }} />
              <span>Recent Transaction Flow Ledger</span>
            </h4>

            <div style={styles.ledgerTable}>
              <div style={styles.ledgerHeader}>
                <span style={{ flex: 1.5 }}>Date</span>
                <span style={{ flex: 2 }}>Item</span>
                <span style={{ flex: 1.5 }}>Category</span>
                <span style={{ flex: 1.5, textAlign: 'right' }}>Amount</span>
              </div>

              {recentTransactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                  No recent transactions found on record.
                </div>
              ) : (
                recentTransactions.map((tx) => (
                  <div key={tx.id} style={styles.ledgerRow} className="ledger-row-node">
                    <span style={{ flex: 1.5, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{tx.date}</span>
                    <span style={{ flex: 2, fontWeight: '700', fontSize: '0.85rem' }}>{tx.title}</span>
                    <span style={{ flex: 1.5 }}>
                      <span className={`ledger-cat-badge ${tx.type}`}>
                        {tx.category}
                      </span>
                    </span>
                    <span style={{ 
                      flex: 1.5, 
                      textAlign: 'right', 
                      fontWeight: '800', 
                      fontSize: '0.85rem',
                      color: tx.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)'
                    }}>
                      {tx.type === 'income' ? '+' : '-'}{currency}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS for printing media and local badges */}
      <style dangerouslySetInnerHTML={{__html: `
        .badge-live-preview {
          margin-left: auto;
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: var(--color-primary);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          text-transform: uppercase;
        }

        .ledger-cat-badge {
          font-size: 0.7rem;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          font-weight: 600;
        }
        
        .ledger-cat-badge.income {
          background: rgba(16, 185, 129, 0.08);
          color: var(--color-success);
        }

        .ledger-cat-badge.expense {
          background: rgba(239, 68, 68, 0.08);
          color: var(--color-danger);
        }

        /* PRINT STYLESHEET OVERWRITES */
        @media print {
          body {
            background: #ffffff !important;
            color: #0f172a !important;
          }
          
          .no-print {
            display: none !important;
          }

          .sidebar {
            display: none !important;
          }

          .top-navbar {
            display: none !important;
          }

          .main-content-wrapper {
            margin-left: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }

          .main-content {
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }

          .print-preview-card {
            background: #ffffff !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            color: #0f172a !important;
          }

          .print-only-header {
            display: block !important;
          }

          .metric-print-border {
            border: 1px solid #e2e8f0 !important;
            background: #f8fafc !important;
            color: #0f172a !important;
          }

          .metric-print-border span {
            color: #0f172a !important;
          }

          .ledger-row-node {
            border-bottom: 1px solid #e2e8f0 !important;
            color: #0f172a !important;
          }

          .ledger-row-node span {
            color: #0f172a !important;
          }

          .ledger-cat-badge {
            background: none !important;
            border: 1px solid #e2e8f0 !important;
            color: #0f172a !important;
          }
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
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    width: '100%',
  },
  exporterPanel: {
    flex: 1,
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '2rem 1.5rem',
  },
  previewPanel: {
    flex: 1.8,
    minWidth: '320px',
    padding: '2rem 1.75rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderBottom: '1px solid var(--border-glass)',
    paddingBottom: '0.75rem',
    width: '100%',
  },
  buttonGroup: {
    marginTop: '2rem',
    width: '100%',
  },
  infoAlert: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    background: 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(59, 130, 246, 0.12)',
    padding: '0.85rem 1rem',
    borderRadius: '12px',
    marginTop: '2rem',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  metricItem: {
    background: 'rgba(6,7,9,0.2)',
    border: '1px solid var(--border-glass)',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  metricLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  metricValue: {
    fontSize: '1.15rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    marginTop: '0.25rem',
  },
  ledgerTable: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid var(--border-glass)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  ledgerHeader: {
    background: 'var(--bg-canvas)',
    borderBottom: '1px solid var(--border-glass)',
    padding: '0.75rem 1rem',
    display: 'flex',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  ledgerRow: {
    padding: '0.85rem 1rem',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-glass)',
    fontSize: '0.85rem',
  }
};

export default Reports;
