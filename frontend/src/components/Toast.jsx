import React, { useEffect } from 'react';
import { IoCheckmarkCircle, IoWarning, IoAlertCircle, IoClose } from 'react-icons/io5';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircle style={{ color: 'var(--color-success)', fontSize: '1.25rem' }} />;
      case 'error':
        return <IoAlertCircle style={{ color: 'var(--color-danger)', fontSize: '1.25rem' }} />;
      case 'warning':
        return <IoWarning style={{ color: 'var(--color-warning)', fontSize: '1.25rem' }} />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.toastContainer} className="glass-card animate-fade-in">
      <div style={styles.toastContent}>
        {getIcon()}
        <span style={styles.message}>{message}</span>
        <button onClick={onClose} style={styles.closeBtn} className="btn-close-hover">
          <IoClose />
        </button>
      </div>
    </div>
  );
};

const styles = {
  toastContainer: {
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    zIndex: 9999,
    padding: '0.85rem 1.25rem',
    minWidth: '280px',
    maxWidth: '400px',
    background: 'var(--bg-surface-solid)',
    border: '1px solid var(--border-glass-hover)',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  toastContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  message: {
    flex: 1,
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
    lineHeight: '1.25',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.2rem',
    borderRadius: '4px',
    transition: 'color var(--transition-fast)',
  }
};

export default Toast;
