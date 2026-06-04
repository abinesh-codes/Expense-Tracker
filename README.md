# 💸 SpendWise — Premium Fintech Expense Tracker & Finance Planner

A full-stack fintech-inspired Expense Tracker and Personal Finance Management platform that helps users monitor income, expenses, budgets, and overall financial health through real-time analytics, AI-powered insights, and professional financial reports.

---

# 🌐 Live Demo

### 🚀 Try SpendWise Online

**Live Application:**  
https://expense-tracker-frontend-xi-lyart.vercel.app/

Explore the complete application including:

- Secure Authentication
- Expense & Income Management
- Financial Analytics Dashboard
- AI Spending Insights
- PDF & CSV Report Generation
- Dark / Light Mode Experience

---

# 📸 Application Screenshots

### Landing Page

<img width="1920" height="1080" alt="landing_page" src="https://github.com/user-attachments/assets/4af05346-f152-4f5e-9934-6ddff138260e" />

### Dashboard Page

<img width="1920" height="1080" alt="dashboard_page" src="https://github.com/user-attachments/assets/27c4a4f4-13ef-4958-bf04-87de0c6522c3" />

### Transaction Page

<img width="1920" height="1080" alt="transaction_page" src="https://github.com/user-attachments/assets/defc6f1f-3a62-4369-a983-16c027eed0a3" />

### Profile Page

<img width="1920" height="1080" alt="Profil;e" src="https://github.com/user-attachments/assets/ccc86fb8-1378-4210-9f3e-1d7d8750557d" />


## 🏠 Landing Page

The premium fintech-inspired landing page introduces users to SpendWise with modern glassmorphism UI, smooth animations, feature highlights, and intuitive navigation.

![Landing Page](screenshots/landing_page.png)

---

## 📊 Dashboard Page

The dashboard provides a complete overview of financial health through summary cards, income-expense metrics, budget tracking, interactive charts, and AI-generated financial insights.

![Dashboard Page](screenshots/dashboard_page.png)

---

## 💳 Transaction Page

The transaction management module allows users to add, edit, delete, search, filter, and sort income and expense records with real-time updates.

![Transaction Page](screenshots/transaction_page.png)

---

## 👤 Profile Page

The profile section enables users to manage account information, customize preferences, and personalize their SpendWise experience.

![Profile Page](screenshots/profile_page.png)

---

# 🚀 Overview

SpendWise is a modern finance management application designed to provide users with a seamless and visually engaging experience for tracking personal finances.

The platform combines secure authentication, intelligent financial analytics, AI-driven spending recommendations, interactive dashboards, and professional report generation into a single ecosystem.

Users can:

- Track income and expenses
- Categorize financial transactions
- Monitor spending patterns
- Set monthly budgets
- View real-time analytics
- Receive AI-based financial suggestions
- Export statements in CSV and PDF formats
- Access data securely from any device

---

# 📁 Project Structure

```bash
SPENDWISE/
│
├── backend/
│   ├── config/
│   │   └── db.py
│   │
│   ├── controllers/
│   │   ├── auth_controller.py
│   │   ├── expense_controller.py
│   │   ├── income_controller.py
│   │   └── analytics_controller.py
│   │
│   ├── middleware/
│   │   └── auth.py
│   │
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── expense_routes.py
│   │   ├── income_routes.py
│   │   └── analytics_routes.py
│   │
│   ├── utils/
│   │   ├── ai_insights.py
│   │   └── report_generator.py
│   │
│   ├── requirements.txt
│   ├── app.py
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

# 🛠️ Technology Stack

## Frontend

- React.js
- Vite
- Context API
- Axios
- Recharts
- CSS3
- Glassmorphism UI
- Responsive Design

## Backend

- Python Flask
- Flask-JWT-Extended
- Flask-CORS
- Bcrypt
- PyMongo

## Database

- MongoDB Atlas

## Reporting

- ReportLab PDF Generator
- CSV Export Utility

## Authentication

- JWT Authentication
- Password Hashing using Bcrypt

## Deployment

- Frontend: Vercel
- Backend: Vercel

---

# 🔄 Workflow

## 1. User Authentication Module

### Signup

- User creates a new account
- Input validation is performed
- Password is encrypted using Bcrypt
- User information is stored in MongoDB Atlas

### Login

- Credentials are verified
- JWT token is generated
- Session is securely maintained
- Protected routes become accessible

---

## 2. Transaction Management Module

### Expense Management

Users can:

- Add expenses
- Edit expenses
- Delete expenses
- Categorize spending

Categories:

- Food
- Travel
- Shopping
- Bills
- Entertainment
- Health
- Others

### Income Management

Users can:

- Add income
- Update income
- Delete income

Income Sources:

- Salary
- Freelance
- Investments
- Gifts
- Others

---

## 3. Financial Analytics Engine

The analytics module continuously processes transaction data and generates:

### Financial Summary Cards

- Total Income
- Total Expenses
- Current Balance
- Monthly Budget Status

### Interactive Charts

#### Area Chart

Displays:

- Income Growth
- Expense Trends
- Cash Flow Movement

#### Pie / Donut Chart

Visualizes:

- Category-wise Spending
- Budget Distribution
- Expense Allocation

---

## 4. AI Financial Advisor

The AI Insights Engine analyzes spending patterns and provides:

- Saving Recommendations
- Budget Warnings
- Expense Reduction Suggestions
- Overspending Alerts
- Financial Health Insights

Example:

> "Your food expenses increased significantly this month. Consider setting a weekly dining budget to improve savings."

---

## 5. Reporting & Export System

Users can generate:

### CSV Reports

- Complete transaction history
- Spreadsheet-compatible exports
- Financial record maintenance

### PDF Statements

Professional reports containing:

- Income Summary
- Expense Summary
- Category Breakdown
- Net Balance Overview
- Styled Financial Tables

---

# 📊 Data Flow

```text
User Actions
      │
      ▼
React Frontend
      │
      ▼
Axios API Requests
      │
      ▼
Flask Backend
      │
      ▼
JWT Authentication
      │
      ▼
MongoDB Atlas
      │
      ▼
Analytics Engine
      │
      ▼
AI Insights Generator
      │
      ▼
Dashboard Visualization
      │
      ▼
Reports & Exports
```

---

# 🎯 Key Features

### 🔐 Secure Authentication

- JWT Authentication
- Password Encryption
- Protected Routes
- Session Management

### 💰 Expense & Income Tracking

- Complete CRUD Operations
- Category-based Tracking
- Real-time Updates

### 📈 Advanced Analytics

- Interactive Charts
- Financial Trends
- Budget Monitoring

### 🤖 AI Spending Advisor

- Personalized Suggestions
- Budget Recommendations
- Spending Analysis

### 📄 Professional Reports

- CSV Export
- PDF Statement Generation
- Downloadable Financial Records

### 🎨 Premium User Interface

- Glassmorphism Design
- Dark / Light Theme
- Responsive Layout
- Smooth Animations

---

# 🔒 Security Features

### Password Protection

- Passwords hashed using Bcrypt
- Plain-text passwords are never stored

### JWT Authentication

- Secure token-based authorization
- Automatic session validation

### Route Protection

- Prevents unauthorized access
- Secures API endpoints

### CORS Security

- Restricted API communication
- Safe cross-origin requests

### Token Expiration

- Automatic logout after expiration
- Reduced security risks

---

# 🚀 Getting Started

## Prerequisites

Install the following:

- Python 3.9+
- Node.js 18+
- MongoDB Atlas Account

---

## Backend Setup

### Clone Repository

```bash
git clone <repository-url>
cd spendwise/backend
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

Windows:

```bash
.\venv\Scripts\activate
```

Linux / macOS:

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### Run Backend

```bash
python app.py
```

Backend URL:

```bash
http://localhost:5000
```

---

## Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Run application:

```bash
npm run dev
```

Frontend URL:

```bash
http://localhost:5173
```

---

# ⚙️ Environment Variables

```env
MONGO_URI=
JWT_SECRET=
PORT=5000
FRONTEND_URL=http://localhost:5173
```

---

# 🎨 Frontend Highlights

- Premium Fintech UI
- Glassmorphism Cards
- Responsive Sidebar Navigation
- Interactive Analytics Dashboard
- Dark & Light Theme Toggle
- Toast Notifications
- Skeleton Loading Effects
- Mobile-Friendly Design

---

# 🌟 Future Enhancements

- Email OTP Verification
- AI Chat Financial Assistant
- Multi-Currency Support
- Bank Account Integration
- Expense Forecasting
- Investment Portfolio Tracking
- Recurring Transactions
- Push Notifications
- Progressive Web App (PWA)
- Mobile Application

---

# 👨‍💻 Author

**ABINESH R**

Full Stack Developer | MERN Stack Developer | Python Developer

---

# ⭐ Support the Project

If you found this project useful, consider giving it a ⭐ Star on GitHub.

Your support helps improve the project and motivates future enhancements.
