import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  IoAnalyticsOutline, 
  IoShieldCheckmarkOutline, 
  IoFlashOutline, 
  IoArrowForward, 
  IoLogoTwitter, 
  IoLogoGithub, 
  IoLogoLinkedin,
  IoStar,
  IoMenuOutline,
  IoCloseOutline
} from 'react-icons/io5';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Stagger Container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  // Text items animation
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 15 }
    }
  };

  // Card slide-up on view
  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 70, damping: 15 }
    }
  };

  return (
    <div className="landing-wrapper">
      {/* Glow Ambient nodes */}
      <div className="landing-glow node-1" />
      <div className="landing-glow node-2" />

      {/* Header / Navbar */}
      <header className="landing-header">
        <div className="landing-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">💸</span>
          <span className="logo-text">SpendWise</span>
        </div>
        <nav className="landing-nav">
          <a href="#features" className="nav-item">Features</a>
          <a href="#pricing" className="nav-item">Methodology</a>
          <a href="#testimonials" className="nav-item">Reviews</a>
        </nav>
        <div className="landing-cta-group">
          {isAuthenticated ? (
            <motion.button 
              onClick={() => navigate('/dashboard')} 
              className="landing-btn btn-secondary"
              whileHover={{ scale: 1.05, borderColor: 'var(--color-primary)' }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Dashboard
            </motion.button>
          ) : (
            <>
              <Link to="/login" className="landing-btn btn-link">Log In</Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup" className="landing-btn btn-pill">Get Started</Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Hamburger menu toggle */}
        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <IoCloseOutline /> : <IoMenuOutline />}
        </button>
      </header>

      {/* Mobile Slide-down Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            className="mobile-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <nav className="mobile-nav-links">
              <a href="#features" onClick={() => setMobileOpen(false)} className="mobile-nav-item">Features</a>
              <a href="#pricing" onClick={() => setMobileOpen(false)} className="mobile-nav-item">Methodology</a>
              <a href="#testimonials" onClick={() => setMobileOpen(false)} className="mobile-nav-item">Reviews</a>
              <div className="mobile-nav-divider" />
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/dashboard');
                  }} 
                  className="landing-btn btn-hero-primary mobile-cta"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Go to Dashboard
                </button>
              ) : (
                <div className="mobile-nav-cta">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="landing-btn btn-secondary mobile-cta">Log In</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="landing-btn btn-primary mobile-cta">Get Started</Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="badge-promo" variants={itemVariants}>
            <span className="badge-spark">✨</span>
            <span>Discover Next-Gen Personal Wealth Management</span>
          </motion.div>
          <motion.h1 className="hero-title" variants={itemVariants}>
            Take absolute control of your <span className="text-gradient">finances</span>
          </motion.h1>
          <motion.p className="hero-subtitle" variants={itemVariants}>
            Track income, set smart category budgets, download tax-ready reports, and leverage AI-quality financial insights. Beautiful, premium dark mode design built for high performance.
          </motion.p>
          <motion.div className="hero-actions" variants={itemVariants}>
            {isAuthenticated ? (
              <motion.button 
                onClick={() => navigate('/dashboard')} 
                className="landing-btn btn-hero-primary"
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139,92,246,0.6)' }}
                whileTap={{ scale: 0.95 }}
              >
                Open Dashboard <IoArrowForward />
              </motion.button>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/signup" className="landing-btn btn-hero-primary">
                    Start Free Trial <IoArrowForward />
                  </Link>
                </motion.div>
                <motion.a 
                  href="#features" 
                  className="landing-btn btn-hero-secondary"
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.06)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Features
                </motion.a>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Floating Mockup Dashboard Card */}
        <motion.div 
          className="hero-mockup"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.25 }}
        >
          <motion.div 
            className="mockup-frame glass-card"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            whileHover={{ scale: 1.02, boxShadow: '0 30px 60px rgba(59,130,246,0.15)' }}
          >
            <div className="mockup-header">
              <div className="dots-row">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <div className="mockup-address">https://app.spendwise.io/dashboard</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-grid-top">
                <div className="mini-card income">
                  <span className="mini-label">Monthly Income</span>
                  <span className="mini-value">₹1,24,500.00</span>
                  <span className="mini-badge">+12.4%</span>
                </div>
                <div className="mini-card expense">
                  <span className="mini-label">Total Expenses</span>
                  <span className="mini-value">₹42,890.00</span>
                  <span className="mini-progress-bar"><span className="progress-fill" /></span>
                </div>
              </div>
              <div className="mockup-graph-placeholder">
                <div className="graph-bar-node h-30" />
                <div className="graph-bar-node h-50" />
                <div className="graph-bar-node h-80" />
                <div className="graph-bar-node h-60" />
                <div className="graph-bar-node h-90" />
                <div className="graph-bar-node h-45" />
                <div className="graph-bar-node h-75" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="section-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Designed to streamline your financial flow</h2>
          <p className="section-subtitle">Everything you need to track spending, optimize budgets, and secure growth.</p>
        </motion.div>

        <div className="feature-grid">
          <motion.div 
            className="glass-card feature-card"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{ y: -8, borderColor: 'rgba(59,130,246,0.3)' }}
          >
            <div className="feature-icon-wrapper blue">
              <IoAnalyticsOutline />
            </div>
            <h3>Interactive Analytics</h3>
            <p>Visualize spending trends with beautiful, interactive charts. Categorize expenses, analyze weekly flows, and view growth rates.</p>
          </motion.div>

          <motion.div 
            className="glass-card feature-card"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{ y: -8, borderColor: 'rgba(139,92,246,0.3)' }}
          >
            <div className="feature-icon-wrapper purple">
              <IoFlashOutline />
            </div>
            <h3>Smart Spending Insights</h3>
            <p>Receive real-time spending warnings and budget alerts. SpendWise detects budget caps and suggests ways to save 20% more.</p>
          </motion.div>

          <motion.div 
            className="glass-card feature-card"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{ y: -8, borderColor: 'rgba(16,185,129,0.3)' }}
          >
            <div className="feature-icon-wrapper green">
              <IoShieldCheckmarkOutline />
            </div>
            <h3>Secure Data Center</h3>
            <p>RESTful APIs fortified with JWT bearer encryption, securely hashed passwords, and MongoDB Atlas cloud storage redundancy.</p>
          </motion.div>
        </div>
      </section>

      {/* Calculation Methodology Section */}
      <section id="pricing" className="section-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Robust Calculation Methodologies</h2>
          <p className="section-subtitle">How our system aggregates, validates, and structures your balance sheet calculations in real-time.</p>
        </motion.div>

        <div className="pricing-grid">
          {/* Method 1 */}
          <motion.div 
            className="glass-card pricing-card"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{ y: -6 }}
          >
            <span className="plan-name" style={{ color: 'var(--color-primary)' }}>Net Balance Aggregation</span>
            <div className="price-block">
              <span className="price-val" style={{ fontSize: '1.35rem', fontWeight: '800' }}>MongoDB Group & Sum</span>
            </div>
            <p className="plan-desc">Sums up transaction logs dynamically by query matching the unique authenticated User ID.</p>
            <ul className="plan-features">
              <li>✓ Dynamic database pipelines</li>
              <li>✓ Sub-second processing speed</li>
              <li>✓ Hashed query matching filters</li>
              <li>✓ Floating-point math precision</li>
              <li>✓ Chronological dataset ordering</li>
            </ul>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ width: '100%', marginTop: 'auto' }}>
              <div style={{ width: '100%', textAlign: 'center', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: '700', border: '1px solid var(--border-glass)', padding: '0.65rem', borderRadius: '10px', background: 'rgba(59,130,246,0.05)' }}>
                Formula: Net Balance = Σ(Income) - Σ(Expenses)
              </div>
            </motion.div>
          </motion.div>

          {/* Method 2 */}
          <motion.div 
            className="glass-card pricing-card recommended"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{ y: -8, boxShadow: '0 25px 50px rgba(139,92,246,0.18)' }}
          >
            <div className="recommended-badge" style={{ background: 'var(--color-purple)' }}>Core Algorithm</div>
            <span className="plan-name" style={{ color: 'var(--color-purple)' }}>Category Budget Caps</span>
            <div className="price-block">
              <span className="price-val" style={{ fontSize: '1.35rem', fontWeight: '800' }}>Percentage Cap Division</span>
            </div>
            <p className="plan-desc">Evaluates category-specific spending sums against user-configured limits to trigger alerts.</p>
            <ul className="plan-features">
              <li>✓ Multi-category database summation</li>
              <li>✓ Near-limit warning alert (at 85%)</li>
              <li>✓ Over-limit violation states (at 100%)</li>
              <li>✓ Dynamic GUI progress animations</li>
              <li>✓ Live threshold variable parsing</li>
            </ul>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ width: '100%', marginTop: 'auto' }}>
              <div style={{ width: '100%', textAlign: 'center', color: 'var(--color-purple)', fontSize: '0.8rem', fontWeight: '700', border: '1px solid rgba(139,92,246,0.3)', padding: '0.65rem', borderRadius: '10px', background: 'rgba(139,92,246,0.08)' }}>
                Formula: Cap% = (Spent / Limit) × 100
              </div>
            </motion.div>
          </motion.div>

          {/* Method 3 */}
          <motion.div 
            className="glass-card pricing-card"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{ y: -6 }}
          >
            <span className="plan-name" style={{ color: 'var(--color-success)' }}>Monthly Trend Trajectory</span>
            <div className="price-block">
              <span className="price-val" style={{ fontSize: '1.35rem', fontWeight: '800' }}>Chronological Bucketing</span>
            </div>
            <p className="plan-desc">Groups transaction dates dynamically into chronological year/month objects for Recharts mapping.</p>
            <ul className="plan-features">
              <li>✓ MongoDB Date Aggregator extraction</li>
              <li>✓ Rolling 6-month visual window</li>
              <li>✓ Area-chart coordinate output</li>
              <li>✓ Automatic empty-state fallback padding</li>
              <li>✓ Live trend differential metrics</li>
            </ul>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ width: '100%', marginTop: 'auto' }}>
              <div style={{ width: '100%', textAlign: 'center', color: 'var(--color-success)', fontSize: '0.8rem', fontWeight: '700', border: '1px solid var(--border-glass)', padding: '0.65rem', borderRadius: '10px', background: 'rgba(16,185,129,0.05)' }}>
                Formula: Group(Year(Date), Month(Date))
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section id="testimonials" className="section-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Loved by thousands of budgeters</h2>
          <p className="section-subtitle">See what our premium members say about their experience using SpendWise.</p>
        </motion.div>

        <div className="reviews-grid">
          <motion.div 
            className="glass-card review-card"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{ y: -4 }}
          >
            <div className="stars-row">
              {[...Array(5)].map((_, i) => <IoStar key={i} className="star-icon" />)}
            </div>
            <p className="review-text">
              "SpendWise completely changed how I look at my cash flow. The HSL dark mode is so easy on the eyes and the budget warning alerts saved me ₹15,000 in my first month!"
            </p>
            <div className="review-user">
              <div className="review-avatar">AK</div>
              <div className="review-meta">
                <span className="name">Abinesh Kumar</span>
                <span className="role">Senior Web Engineer</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="glass-card review-card"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{ y: -4 }}
          >
            <div className="stars-row">
              {[...Array(5)].map((_, i) => <IoStar key={i} className="star-icon" />)}
            </div>
            <p className="review-text">
              "The PDF financial statements generator is incredibly fast and highly professional. I simply click download and hand it over to my CA during audit season."
            </p>
            <div className="review-user">
              <div className="review-avatar">PS</div>
              <div className="review-meta">
                <span className="name">Priya Sharma</span>
                <span className="role">Freelance Designer</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-logo">
            <span className="logo-icon">💸</span>
            <span className="logo-text">SpendWise</span>
          </div>
          <p className="footer-tagline">Simplifying wealth building and financial freedom through gorgeous layouts and secure tech.</p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon"><IoLogoTwitter /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon"><IoLogoGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon"><IoLogoLinkedin /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} SpendWise Inc. All rights reserved. Built with Vite, React, Flask, and MongoDB.</span>
        </div>
      </footer>

      {/* Custom Styles Embedded for the Landing UI */}
      <style dangerouslySetInnerHTML={{__html: `
        .landing-wrapper {
          width: 100vw;
          height: 100vh;
          background-color: #060709;
          color: #f8fafc;
          font-family: var(--font-body);
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
          scroll-behavior: smooth;
        }

        .landing-glow {
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          z-index: 1;
        }

        .landing-glow.node-1 {
          top: -10%;
          right: -5%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
        }

        .landing-glow.node-2 {
          top: 40%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%);
        }

        .landing-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 6%;
          position: relative;
          z-index: 100;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          background: rgba(6, 7, 9, 0.6);
          backdrop-filter: blur(12px);
        }

        .landing-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .landing-nav {
          display: flex;
          gap: 2rem;
        }

        .nav-item {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .nav-item:hover {
          color: #f8fafc;
        }

        .landing-cta-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .landing-btn {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-link {
          color: #94a3b8;
        }

        .btn-link:hover {
          color: #f8fafc;
        }

        .btn-pill {
          background: #ffffff;
          color: #060709;
          padding: 0.6rem 1.25rem;
          border-radius: 99px;
          border: none;
          display: inline-flex;
          align-items: center;
        }

        .btn-pill:hover {
          background: #e2e8f0;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f8fafc;
          padding: 0.6rem 1.25rem;
          border-radius: 99px;
          display: inline-flex;
          align-items: center;
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.08);
        }

        .hero-section {
          padding: 8rem 6% 6rem 6%;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          align-items: center;
          gap: 4rem;
          position: relative;
          z-index: 5;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .badge-promo {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 99px;
          padding: 0.4rem 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #3b82f6;
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          color: #94a3b8;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 580px;
        }

        .hero-actions {
          display: flex;
          gap: 1.25rem;
        }

        .btn-hero-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          padding: 0.95rem 1.75rem;
          border-radius: 12px;
          border: none;
          box-shadow: 0 4px 15px rgba(59,130,246,0.3);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-hero-secondary {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          color: #f8fafc;
          padding: 0.95rem 1.75rem;
          border-radius: 12px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .hero-mockup {
          position: relative;
        }

        .mockup-frame {
          background: rgba(18, 22, 33, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.6);
          overflow: hidden;
          width: 100%;
        }

        .mockup-header {
          background: rgba(6, 7, 9, 0.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0.75rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .dots-row {
          display: flex;
          gap: 0.35rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 99px;
        }

        .dot.red { background-color: #ef4444; }
        .dot.yellow { background-color: #eab308; }
        .dot.green { background-color: #10b981; }

        .mockup-address {
          font-family: monospace;
          font-size: 0.7rem;
          color: #475569;
          background: rgba(6, 7, 9, 0.6);
          padding: 0.2rem 1.5rem;
          border-radius: 99px;
          flex: 1;
          text-align: center;
          max-width: 300px;
        }

        .mockup-body {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .mockup-grid-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .mini-card {
          background: rgba(6,7,9,0.3);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .mini-label {
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 700;
        }

        .mini-value {
          font-size: 1.15rem;
          font-weight: 800;
          font-family: var(--font-display);
          margin-top: 0.25rem;
        }

        .mini-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.65rem;
          font-weight: 700;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .mini-progress-bar {
          background: rgba(255,255,255,0.06);
          height: 5px;
          border-radius: 99px;
          width: 100%;
          margin-top: 0.6rem;
          overflow: hidden;
        }

        .progress-fill {
          display: block;
          height: 100%;
          width: 65%;
          background: #3b82f6;
          border-radius: 99px;
        }

        .mockup-graph-placeholder {
          height: 140px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 0 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .graph-bar-node {
          width: 11%;
          background: linear-gradient(to top, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.8));
          border-radius: 8px 8px 0 0;
          height: 0;
          animation: barGrow 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .graph-bar-node:nth-child(1) { animation-delay: 0.1s; --h: 30%; }
        .graph-bar-node:nth-child(2) { animation-delay: 0.2s; --h: 50%; }
        .graph-bar-node:nth-child(3) { animation-delay: 0.3s; --h: 80%; }
        .graph-bar-node:nth-child(4) { animation-delay: 0.4s; --h: 60%; }
        .graph-bar-node:nth-child(5) { animation-delay: 0.5s; --h: 90%; }
        .graph-bar-node:nth-child(6) { animation-delay: 0.6s; --h: 45%; }
        .graph-bar-node:nth-child(7) { animation-delay: 0.7s; --h: 75%; }

        @keyframes barGrow {
          to { height: var(--h); }
        }

        .section-container {
          padding: 6rem 6%;
          position: relative;
          z-index: 5;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }

        .section-subtitle {
          color: #94a3b8;
          font-size: 1rem;
          max-width: 600px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .feature-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .feature-icon-wrapper.blue {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .feature-icon-wrapper.purple {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
        }

        .feature-icon-wrapper.green {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .feature-card h3 {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.25rem;
        }

        .feature-card p {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          align-items: stretch;
          max-width: 1000px;
          margin: 0 auto;
        }

        .pricing-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 2.5rem 2.25rem;
          gap: 1.25rem;
          position: relative;
        }

        .pricing-card.recommended {
          background: rgba(26, 32, 53, 0.65);
          border: 1px solid rgba(139, 92, 246, 0.3);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.1);
        }

        .recommended-badge {
          position: absolute;
          top: 1.25rem;
          right: 1.5rem;
          background: var(--color-purple);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 99px;
          text-transform: uppercase;
        }

        .plan-name {
          font-size: 1.1rem;
          font-weight: 800;
          font-family: var(--font-display);
          color: #94a3b8;
        }

        .pricing-card.recommended .plan-name {
          color: #8b5cf6;
        }

        .price-block {
          display: flex;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .price-val {
          font-size: 2.5rem;
          font-weight: 800;
          font-family: var(--font-display);
        }

        .price-period {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 0.4rem;
        }

        .plan-desc {
          font-size: 0.85rem;
          color: #94a3b8;
          line-height: 1.4;
          min-height: 40px;
        }

        .plan-features {
          list-style: none;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.04);
          padding-top: 1.5rem;
          margin-top: 0.5rem;
          flex: 1;
        }

        .plan-features li {
          font-size: 0.85rem;
          color: #e2e8f0;
        }

        .plan-features li.disabled {
          color: #475569;
        }

        .pricing-action {
          width: 100%;
          text-align: center;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .review-card {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .stars-row {
          display: flex;
          gap: 0.25rem;
        }

        .star-icon {
          color: #eab308;
          font-size: 1.1rem;
        }

        .review-text {
          font-size: 0.95rem;
          color: #e2e8f0;
          line-height: 1.6;
          font-style: italic;
        }

        .review-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .review-avatar {
          width: 42px;
          height: 42px;
          border-radius: 99px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
        }

        .review-meta {
          display: flex;
          flex-direction: column;
        }

        .review-meta .name {
          font-weight: 700;
          font-size: 0.9rem;
        }

        .review-meta .role {
          font-size: 0.75rem;
          color: #64748b;
        }

        .landing-footer {
          background: #040508;
          border-top: 1px solid rgba(255,255,255,0.03);
          padding: 5rem 6% 3rem 6%;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          position: relative;
          z-index: 10;
        }

        .footer-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-tagline {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.6;
        }

        .social-links {
          display: flex;
          gap: 1.25rem;
        }

        .social-icon {
          color: #475569;
          font-size: 1.35rem;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .social-icon:hover {
          color: #f8fafc;
          transform: translateY(-2px);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.02);
          padding-top: 2rem;
          text-align: center;
          font-size: 0.75rem;
          color: #475569;
        }

        /* Mobile Hamburger & Slide-down CSS */
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 2rem;
          cursor: pointer;
          z-index: 110;
        }

        .mobile-toggle:hover {
          color: #f8fafc;
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(6, 7, 9, 0.98);
          z-index: 99;
          display: flex;
          flex-direction: column;
          padding: 6.5rem 2rem 2rem 2rem;
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .mobile-nav-item {
          color: #f8fafc;
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 700;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .mobile-nav-item:hover {
          opacity: 0.8;
        }

        .mobile-nav-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 1rem 0;
        }

        .mobile-nav-cta {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-cta {
          width: 100%;
          justify-content: center;
          height: 48px;
          display: flex;
          align-items: center;
        }

        /* Mobile Responsive Adjustments */
        @media (max-width: 968px) {
          .hero-section {
            grid-template-columns: 1fr;
            padding-top: 6rem;
            text-align: center;
            gap: 3rem;
          }

          .hero-content {
            align-items: center;
          }

          .hero-title {
            font-size: 2.75rem;
          }

          .landing-header {
            padding: 1.25rem 4%;
          }

          .landing-nav, .landing-cta-group {
            display: none;
          }

          .mobile-toggle {
            display: block;
          }
        }
      `}} />
    </div>
  );
};

export default Home;
