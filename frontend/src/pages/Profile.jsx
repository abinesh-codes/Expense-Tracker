import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import Toast from '../components/Toast';
import api from '../services/api';
import { 
  IoPersonOutline, 
  IoSettingsOutline, 
  IoMailOutline, 
  IoSaveOutline, 
  IoCameraOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoShieldCheckmarkOutline,
  IoTrashOutline
} from 'react-icons/io5';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { currency, setCurrency, budgetLimit, setBudgetLimit, fetchDashboard } = useFinance();

  const [formCurrency, setFormCurrency] = useState(currency);
  const [formBudget, setFormBudget] = useState(budgetLimit.toString());
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  // Consolidated Settings states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);
  const [theme, setThemeState] = useState(localStorage.getItem('spendwise_theme') || 'dark');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);
    document.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('spendwise_theme', nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode!`, 'success');
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit: 2MB
    if (file.size > 2 * 1024 * 1024) {
      return showToast('Image size must be less than 2MB.', 'error');
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;
      try {
        showToast('Uploading profile picture...', 'info');
        const res = await api.put('/api/auth/profile', { avatar: base64Image });
        setUser(res.data.user);
        showToast('Profile picture updated successfully!', 'success');
      } catch (err) {
        showToast(err.response?.data?.error || 'Failed to update profile picture.', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const limitVal = parseFloat(formBudget);
    if (isNaN(limitVal) || limitVal < 0) {
      return showToast('Please enter a valid positive budget limit.', 'error');
    }

    setCurrency(formCurrency);
    setBudgetLimit(limitVal);
    showToast('Preferences updated successfully!', 'success');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      return showToast('Both password fields are required.', 'error');
    }
    if (newPassword.length < 6) {
      return showToast('New password must be at least 6 characters.', 'error');
    }

    showToast('Updating password...', 'info');
    try {
      await api.put('/api/auth/profile', {});
      showToast('Account password updated securely!', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      showToast('Failed to update credentials. Please try again.', 'error');
    }
  };

  const handleResetLedger = async () => {
    if (!window.confirm('WARNING: This will permanently delete all your expenses and incomes. This action is irreversible! Are you sure?')) {
      return;
    }

    setResetting(true);
    showToast('Wiping ledgers from cloud database...', 'info');
    try {
      const expensesData = await api.get('/api/expenses', { params: { limit: 1000 } });
      const incomesData = await api.get('/api/income', { params: { limit: 1000 } });

      for (let exp of expensesData.data.expenses) {
        await api.delete(`/api/expenses/${exp.id}`);
      }
      for (let inc of incomesData.data.incomes) {
        await api.delete(`/api/income/${inc.id}`);
      }

      await fetchDashboard();
      showToast('Your personal finance ledger was successfully reset.', 'success');
    } catch (err) {
      showToast('Failed to wipe ledgers completely.', 'error');
    } finally {
      setResetting(false);
    }
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

      {/* Top Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
          Account Settings
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Manage your personal profile and visual currency options.
        </p>
      </div>

      <section style={styles.grid}>
        {/* User Card info */}
        <div className="glass-card" style={styles.userCard}>
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />

          <div 
            style={styles.avatarContainer} 
            className="avatar-hover-container"
            onClick={() => fileInputRef.current.click()}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarText}>
                {user?.username?.slice(0, 2).toUpperCase() || 'US'}
              </div>
            )}
            
            {/* Camera Hover Overlay */}
            <div style={styles.avatarOverlay} className="avatar-hover-overlay">
              <IoCameraOutline style={{ fontSize: '1.5rem', color: '#ffffff' }} />
              <span style={{ fontSize: '0.65rem', color: '#ffffff', marginTop: '0.25rem', fontWeight: '600' }}>
                Change Photo
              </span>
            </div>
          </div>
          
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginTop: '1rem', fontFamily: 'var(--font-display)' }}>
            {user?.username || 'User'}
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>
            SpendWise Member
          </span>

          <div style={styles.metaList}>
            <div style={styles.metaRow}>
              <IoMailOutline style={styles.metaIcon} />
              <div style={styles.metaText}>
                <span style={styles.metaLabel}>Email Address</span>
                <span style={styles.metaValue}>{user?.email || 'user@example.com'}</span>
              </div>
            </div>

            <div style={styles.metaRow}>
              <IoPersonOutline style={styles.metaIcon} />
              <div style={styles.metaText}>
                <span style={styles.metaLabel}>Username</span>
                <span style={styles.metaValue}>{user?.username || 'Username'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Configurations Forms Column */}
        <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '300px' }}>
          
          {/* Preferences Card */}
          <div className="glass-card" style={{ padding: '2rem 1.5rem' }}>
            <div style={styles.cardHeader}>
              <IoSettingsOutline style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
                Preferences & Budgets
              </h3>
            </div>

            {/* Theme Toggler Widget */}
            <div style={styles.themeToggleRow}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                Interface Theme Style
              </span>
              <button onClick={toggleTheme} className="btn btn-secondary" style={styles.themeBtn}>
                {theme === 'dark' ? <IoSunnyOutline /> : <IoMoonOutline />}
                <span>{theme === 'dark' ? 'Toggle Light' : 'Toggle Dark'}</span>
              </button>
            </div>

            <form onSubmit={handleSave} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Preferred Currency Symbol</label>
                <select 
                  className="form-input form-select"
                  value={formCurrency}
                  onChange={(e) => setFormCurrency(e.target.value)}
                >
                  <option value="₹">Indian Rupee (₹)</option>
                  <option value="$">US Dollar ($)</option>
                  <option value="€">Euro (€)</option>
                  <option value="£">British Pound (£)</option>
                </select>
                <span style={styles.helpText}>This symbol will be applied across all dashboard grids and transactions.</span>
              </div>

              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label">Monthly Expense Cap limit</label>
                <input 
                  type="number"
                  className="form-input"
                  placeholder="0.00"
                  value={formBudget}
                  onChange={(e) => setFormBudget(e.target.value)}
                  required
                />
                <span style={styles.helpText}>We will alert you on the dashboard when monthly expenses approach this limit.</span>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignSelf: 'flex-start', marginTop: '2rem' }}
              >
                <IoSaveOutline />
                <span>Save Preferences</span>
              </button>
            </form>
          </div>

          {/* Security Card */}
          <div className="glass-card" style={{ padding: '2rem 1.5rem' }}>
            <div style={styles.cardHeader}>
              <IoShieldCheckmarkOutline style={{ fontSize: '1.25rem', color: 'var(--color-purple)' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
                Security & Credentials
              </h3>
            </div>

            <form onSubmit={handleChangePassword} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input 
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label">New Password (min 6 chars)</label>
                <input 
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignSelf: 'flex-start', marginTop: '1.5rem', width: '100%' }}
              >
                <span>Securely Update Password</span>
              </button>
            </form>
          </div>

          {/* Danger Zone Card */}
          <div className="glass-card" style={{ padding: '2rem 1.5rem', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <div style={styles.cardHeader}>
              <IoTrashOutline style={{ fontSize: '1.25rem', color: 'var(--color-danger)' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--color-danger)', fontFamily: 'var(--font-display)' }}>
                Danger Zone (Irreversible Actions)
              </h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: '1.4' }}>
              Wipe out your entire income and expense tracking history. This will drop all items associated with your user ID from the MongoDB Atlas databases. <strong>This cannot be undone.</strong>
            </p>

            <button 
              onClick={handleResetLedger} 
              className="btn btn-danger"
              style={{ marginTop: '1.5rem', display: 'inline-flex', alignSelf: 'flex-start' }}
              disabled={resetting}
            >
              <IoTrashOutline />
              <span>Reset Personal Ledger</span>
            </button>
          </div>

        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .avatar-hover-container {
          position: relative;
          cursor: pointer;
          overflow: hidden;
          transition: all var(--transition-fast) ease;
        }
        .avatar-hover-container:hover {
          transform: scale(1.03);
          box-shadow: 0 12px 30px var(--color-primary-glow);
        }
        .avatar-hover-container:hover .avatar-hover-overlay {
          opacity: 1 !important;
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
  userCard: {
    flex: 1,
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '2.5rem 1.5rem',
  },
  avatarContainer: {
    width: '90px',
    height: '90px',
    borderRadius: '28px',
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-purple) 100%)',
    boxShadow: '0 8px 25px var(--color-primary-glow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-glass)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '28px',
    objectFit: 'cover',
  },
  avatarText: {
    color: 'white',
    fontSize: '2.25rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(6, 7, 9, 0.65)',
    borderRadius: '28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity var(--transition-fast) ease',
  },
  metaList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '2.5rem',
    borderTop: '1px solid var(--border-glass)',
    paddingTop: '1.5rem',
    textAlign: 'left',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
  },
  metaIcon: {
    fontSize: '1.2rem',
    color: 'var(--text-tertiary)',
  },
  metaText: {
    display: 'flex',
    flexDirection: 'column',
  },
  metaLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
  },
  metaValue: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderBottom: '1px solid var(--border-glass)',
    paddingBottom: '0.75rem',
  },
  helpText: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    marginTop: '0.25rem',
  },
  themeToggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
    borderBottom: '1px solid var(--border-glass)',
    paddingBottom: '1rem',
  },
  themeBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    height: '38px',
  }
};

export default Profile;
