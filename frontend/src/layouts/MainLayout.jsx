import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { 
  IoGridOutline, 
  IoCashOutline, 
  IoTrendingUpOutline, 
  IoPersonOutline, 
  IoLogOutOutline, 
  IoMenuOutline, 
  IoCloseOutline,
  IoMoonOutline,
  IoSunnyOutline
} from 'react-icons/io5';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const { currency } = useFinance();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('spendwise_theme') || 'dark');

  // Toggle layout theme state (dark/light)
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('spendwise_theme', theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-container">
      {/* Side Navigation Bar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">💸</span>
          <span className="logo-text">SpendWise</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <IoGridOutline className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/transactions" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <IoCashOutline className="nav-icon" />
            <span>Transactions</span>
          </NavLink>

          <NavLink 
            to="/analytics" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <IoTrendingUpOutline className="nav-icon" />
            <span>Analytics</span>
          </NavLink>

          <NavLink 
            to="/profile" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <IoPersonOutline className="nav-icon" />
            <span>Profile</span>
          </NavLink>
        </nav>

        {/* User Card & Logout inside Sidebar */}
        <div className="sidebar-footer">
          <div className="user-profile-widget">
            <div className="avatar-placeholder" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.username?.slice(0, 2).toUpperCase() || 'US'
              )}
            </div>
            <div className="user-meta">
              <span className="username">{user?.username || 'User'}</span>
              <span className="email">{user?.email || 'user@example.com'}</span>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-logout">
            <IoLogOutOutline className="logout-icon" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay backdrop for mobile side menus */}
      {mobileMenuOpen && (
        <div className="sidebar-overlay-bg" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Header Bar */}
      <div className="mobile-header">
        <button className="menu-toggle-btn" onClick={() => setMobileMenuOpen(true)}>
          <IoMenuOutline />
        </button>
        <div className="mobile-logo">SpendWise 💸</div>
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <IoSunnyOutline /> : <IoMoonOutline />}
        </button>
      </div>

      {/* Main Workspace Frame */}
      <div className="main-content-wrapper">
        {/* Top Desktop Navbar Bar */}
        <header className="top-navbar">
          <div className="navbar-left">
            <span className="welcome-tag">Welcome back,</span>
            <span className="welcome-name">{user?.username || 'Guest'} 👋</span>
          </div>

          <div className="navbar-right">
            <button className="navbar-theme-btn" onClick={toggleTheme}>
              {theme === 'dark' ? <IoSunnyOutline /> : <IoMoonOutline />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <div className="navbar-divider" />

            <div className="navbar-profile" onClick={() => navigate('/profile')}>
              <div className="navbar-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.username?.slice(0, 2).toUpperCase() || 'US'
                )}
              </div>
              <div className="navbar-profile-meta">
                <span className="profile-name">{user?.username}</span>
                <span className="profile-role">Premium Member</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested View rendering */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* Embedded CSS specific to Navigation Frame layout */}
      <style dangerouslySetInnerHTML={{__html: `
        .sidebar {
          width: 280px;
          height: 100vh;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border-glass);
          display: flex;
          flex-direction: column;
          padding: 2rem 1.5rem;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 99;
          transition: transform var(--transition-normal), background-color var(--transition-normal);
          box-shadow: var(--sidebar-shadow);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 3.5rem;
        }

        .logo-icon {
          font-size: 2rem;
        }

        .logo-text {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.5rem;
          background: linear-gradient(135deg, var(--text-primary) 30%, var(--color-primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          flex: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1.25rem;
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          font-family: var(--font-display);
          font-size: 0.95rem;
          transition: color var(--transition-fast), background var(--transition-fast), border var(--transition-fast);
          border: 1px solid transparent;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
          border-color: var(--border-glass);
        }

        body[data-theme='light'] .nav-link:hover {
          background: rgba(15, 23, 42, 0.03);
        }

        .nav-link.active {
          color: white;
          background: linear-gradient(135deg, var(--color-primary) 0%, rgba(139, 92, 246, 0.75) 100%);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.25);
        }

        .nav-icon {
          font-size: 1.25rem;
        }

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-glass);
        }

        .user-profile-widget {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .avatar-placeholder {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-purple) 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-family: var(--font-display);
        }

        .user-meta {
          display: flex;
          flex-direction: column;
          max-width: 150px;
        }

        .username {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .email {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          padding: 0.85rem 1.25rem;
          background: transparent;
          border: 1px solid var(--border-glass);
          border-radius: 12px;
          color: var(--text-secondary);
          font-weight: 600;
          font-family: var(--font-display);
          cursor: pointer;
          transition: border-color var(--transition-fast), color var(--transition-fast);
        }

        .btn-logout:hover {
          border-color: var(--color-danger);
          color: var(--color-danger);
          background: rgba(239, 68, 68, 0.05);
        }

        .main-content-wrapper {
          flex: 1;
          height: 100vh;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .top-navbar {
          height: 76px;
          background: var(--bg-canvas);
          border-bottom: 1px solid var(--border-glass);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          transition: background-color var(--transition-normal);
        }

        .welcome-tag {
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: block;
        }

        .welcome-name {
          font-weight: 800;
          font-size: 1.2rem;
          font-family: var(--font-display);
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .navbar-theme-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          padding: 0.5rem 1rem;
          border-radius: 10px;
          cursor: pointer;
          color: var(--text-primary);
          font-weight: 600;
          font-family: var(--font-display);
          font-size: 0.85rem;
          transition: border var(--transition-fast);
        }

        .navbar-theme-btn:hover {
          border-color: var(--border-glass-hover);
        }

        .navbar-theme-btn svg {
          font-size: 1.1rem;
        }

        .navbar-divider {
          width: 1px;
          height: 24px;
          background: var(--border-glass);
        }

        .navbar-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .navbar-avatar {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--border-glass);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-family: var(--font-display);
        }

        body[data-theme='light'] .navbar-avatar {
          background: rgba(15, 23, 42, 0.05);
        }

        .navbar-profile-meta {
          display: flex;
          flex-direction: column;
        }

        .profile-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .profile-role {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .mobile-header {
          display: none;
        }

        .sidebar-overlay-bg {
          display: none;
        }

        /* Responsive Breakpoints Layout adjustment */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            z-index: 1001;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar-overlay-bg {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 1000;
          }

          .main-content-wrapper {
            margin-left: 0;
            height: 100vh;
          }

          .top-navbar {
            display: none;
          }

          .mobile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 60px;
            width: 100%;
            background: var(--bg-sidebar);
            border-bottom: 1px solid var(--border-glass);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 998;
            padding: 0 1.25rem;
          }

          .menu-toggle-btn, .theme-toggle-btn {
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-logo {
            font-family: var(--font-display);
            font-weight: 800;
            font-size: 1.2rem;
          }
        }
      `}} />
    </div>
  );
};

export default MainLayout;
