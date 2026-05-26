import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { register, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Clear global state validation warnings on mount
  useEffect(() => {
    clearError();
  }, []);

  // Redirect if logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      return setFormError('All fields are required.');
    }

    if (username.trim().length < 3) {
      return setFormError('Username must be at least 3 characters long.');
    }

    if (password.length < 6) {
      return setFormError('Password must be at least 6 characters long.');
    }

    if (password !== confirmPassword) {
      return setFormError('Passwords do not match. Please verify.');
    }

    setSubmitting(true);
    const res = await register(username.trim(), email.trim().toLowerCase(), password);
    setSubmitting(false);

    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div style={styles.authContainer} className="auth-background-ambient">
      <div style={styles.glowNode1} className="glow-node" />
      <div style={styles.glowNode2} className="glow-node" />

      <div style={styles.authCard} className="glass-card animate-fade-in">
        <div style={styles.header}>
          <span style={styles.logo}>SpendWise 💸</span>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Sign up for a modern fintech dashboard and take control of your expenses.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {(formError || error) && (
            <div style={styles.errorAlert}>
              {formError || error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Abinesh"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.75rem', height: '48px' }}
            disabled={submitting}
          >
            {submitting ? 'Registering...' : 'Get Started'}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>Already have an account?</span>
          <Link to="/login" style={styles.footerLink}>Log in to SpendWise</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  authContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  authCard: {
    width: '100%',
    maxWidth: '430px',
    padding: '2.5rem 2.25rem',
    zIndex: 10,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-glass)',
    boxShadow: '0 30px 60px -15px var(--glass-shadow)',
  },
  glowNode1: {
    position: 'absolute',
    top: '15%',
    left: '20%',
    width: '250px',
    height: '250px',
    borderRadius: '999px',
    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowNode2: {
    position: 'absolute',
    bottom: '15%',
    right: '20%',
    width: '300px',
    height: '300px',
    borderRadius: '999px',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    fontSize: '1.75rem',
    background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--color-primary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'block',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
    marginBottom: '0.35rem',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  form: {
    width: '100%',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.35rem',
    marginTop: '1.5rem',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '0.85rem',
    color: 'var(--text-tertiary)',
  },
  footerLink: {
    fontSize: '0.85rem',
    color: 'var(--color-primary)',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color var(--transition-fast)',
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid var(--color-danger)',
    borderRadius: '10px',
    color: 'var(--color-danger)',
    fontSize: '0.85rem',
    padding: '0.75rem 1rem',
    marginBottom: '1.25rem',
    fontWeight: '500',
    lineHeight: '1.35',
  }
};

export default Signup;
