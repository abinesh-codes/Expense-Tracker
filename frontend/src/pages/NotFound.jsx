import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoAlertCircleOutline } from 'react-icons/io5';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container} className="animate-fade-in">
      <IoAlertCircleOutline style={styles.icon} />
      <h2 style={styles.title}>404 — Screen Not Found</h2>
      <p style={styles.text}>The financial directory or page you are looking for does not exist or has been shifted.</p>
      <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
        Return to Dashboard
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '3rem 1.5rem',
    minHeight: '60vh',
  },
  icon: {
    fontSize: '5rem',
    color: 'var(--color-primary)',
    opacity: 0.8,
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    marginBottom: '0.5rem',
  },
  text: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    maxWidth: '380px',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
  }
};

export default NotFound;
