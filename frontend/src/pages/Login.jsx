import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Clear global context errors on mount
  useEffect(() => {
    clearError();
  }, []);

  // Redirect to Dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (!email.trim() || !password) {
      return setFormError('Please enter both your email and password.');
    }

    setSubmitting(true);
    const res = await login(email.trim(), password);
    setSubmitting(false);

    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div style={styles.authContainer} className="auth-background-ambient">
      {/* Decorative ambient glowing nodes */}
      <div style={styles.glowNode1} className="glow-node" />
      <div style={styles.glowNode2} className="glow-node" />

      <div style={styles.authCard} className="glass-card animate-fade-in">
        <div style={styles.header}>
          <span style={styles.logo}>SpendWise 💸</span>
          <h2 style={styles.title}>Secure Log In</h2>
          <p style={styles.subtitle}>Enter your credentials to access your finance dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {(formError || error) && (
            <div style={styles.errorAlert}>
              {formError || error}
            </div>
          )}

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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.75rem', height: '48px' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>New to SpendWise?</span>
          <Link to="/signup" style={styles.footerLink}>Create a premium account</Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatGlow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }

        .auth-background-ambient {
          background-color: #060709;
          position: relative;
          overflow: hidden;
        }

        body[data-theme='light'] .auth-background-ambient {
          background-color: #f4f6fa;
        }

        .glow-node {
          animation: floatGlow 8s infinite ease-in-out;
        }
      `}} />
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
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowNode2: {
    position: 'absolute',
    bottom: '15%',
    right: '20%',
    width: '300px',
    height: '300px',
    borderRadius: '999px',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    fontSize: '1.75rem',
    background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--color-primary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'block',
    marginBottom: '0.85rem',
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
    marginTop: '2rem',
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

export default Login;
