# SpendWise — Premium Fintech Expense Tracker & Finance Planner

SpendWise is a visually rich, premium, full-stack Expense Tracker Web Application. Designed with high-concept modern fintech aesthetics, it features silky-smooth animations, a responsive glassmorphism card UI, real-time analytics graphs, CSV and ReportLab PDF statement exports, and dynamic AI-modeled financial advice.

---

## 💸 Key Features

1. **Secure Access Protection**
   * High-security User Signup & Login portals.
   * State-driven input fields validation with immediate error notices.
   * Cryptographically hashed passwords (using `bcrypt` in Python).
   * Secure JWT sessions, automatically injected into Axios client requests.
   * Persistent sessions remembered inside browser memory.

2. **Fintech Metric Summary Cards**
   * Dynamically tracks Total Incomes, Total Expenses, and Net Balance buffers.
   * Shows glowing red/green borders based on cash flow health.
   * Automatic alert trackers warning users if they approach their custom monthly budget caps.

3. **Multi-mode Transaction CRUD Ledger**
   * Form-driven Expense Creation (Food, Travel, Shopping, Bills, Entertainment, Health, Others).
   * Income tracker by source (Salary, Freelance, Investments, Gifts, Others).
   * Fully paginated list with real-time text searching (title/notes), category filtering, and sorting (Latest date, Oldest date, Highest amount, Lowest amount).
   * Clicking line items launches editing screens; deletions trigger automated reactive summaries.

4. **Interactive Recharts Analytics & Smart Insights**
   * Real-time Area Chart illustrating income vs expense trajectory.
   * Custom-colored Pie/Donut Chart visualizing discretionary allocations.
   * Rules-powered AI Spending Advisor displaying tailored saving advice and category deficit notices.

5. **Formal Statements Export**
   * Download instant, valid CSV files of your transaction history.
   * Generate beautifully structured, formal ReportLab PDF statements with custom colors (green indicators, rose red outlines, table headers, and net summary boxes).

6. **Responsive Layouts & Dark Mode**
   * Premium glassmorphism design variables.
   * Fluid, dynamic sidebar navigation and top status navbars.
   * Toggle button to seamlessly shift the entire application theme between Dark and Light mode.
   * Custom rounded scrollbars and skeleton loading transitions.

---

## 🏗️ Architecture Layout

```
├── backend/
│   ├── app.py                     # Main server entrypoint
│   ├── requirements.txt           # Python backend dependencies
│   ├── .env                       # Active Atlas connection configurations
│   ├── config/
│   │   └── db.py                  # PyMongo client connector singleton
│   ├── middleware/
│   │   └── auth.py                # JWT authentication token decorator
│   ├── controllers/
│   │   ├── auth_controller.py     # Login, signup, and profiles handler
│   │   ├── expense_controller.py  # Expense CRUD query manager
│   │   ├── income_controller.py   # Income CRUD query manager
│   │   └── analytics_controller.py# DB aggregates and PDF/CSV encoders
│   ├── routes/
│   │   ├── auth_routes.py         # Auth blueprint urls
│   │   ├── expense_routes.py      # Expense blueprint urls
│   │   ├── income_routes.py       # Income blueprint urls
│   │   └── analytics_routes.py    # Report and aggregations blueprint urls
│   └── utils/
│       ├── ai_insights.py         # Rules-based saving recommendations
│       └── report_generator.py    # ReportLab PDF & CSV generators
│
├── frontend/                      # Frontend React.js codebase directory
│   ├── src/                       # Frontend source files
│   │   ├── assets/                # Static image/media elements
│   │   ├── components/            # Reusable UI overlays & modals
│   │   │   ├── ExpenseModal.jsx   # Expense form modal
│   │   │   ├── IncomeModal.jsx    # Income form modal
│   │   │   └── Toast.jsx          # Micro-interaction alerts
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # User login state & JWT context
│   │   │   └── FinanceContext.jsx # Transaction lists & reactive charts context
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx     # Responsive sidebar & header shell frame
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Public animated landing page with hero banner & pricing
│   │   │   ├── Login.jsx          # Glowing ambient sign-in page
│   │   │   ├── Signup.jsx         # Account registration page
│   │   │   ├── Dashboard.jsx      # Metrics grid & Recharts dashboard
│   │   │   ├── Transactions.jsx   # Unified filterable ledger history page
│   │   │   ├── Analytics.jsx      # AI Insights console
│   │   │   ├── Reports.jsx        # Finance ledger statement audit & printer preview page
│   │   │   ├── Settings.jsx       # Preferences, currency selectors & ledger reset page
│   │   │   ├── Profile.jsx        # Account profile details & avatar configuration
│   │   │   └── NotFound.jsx       # Graceful 404 page
│   │   ├── services/
│   │   │   └── api.js             # Axios instance with auto JWT header intercepters
│   │   ├── styles/
│   │   │   └── index.css          # Styling themes, scrollbars & variables
│   │   ├── App.jsx                # Route guards, redirects & providers wrapping
│   │   └── main.jsx               # React mounting file
│   ├── package.json               # Node packages description
│   ├── vite.config.js             # Vite compiler config & port 5000 proxy
│   └── index.html                 # Viewport, page titles & Outfit fonts preloading
```

---

## 🚀 Local Installation Guide

### Prerequisite Accounts
* **Python 3.9+** & **Node.js 18+** installed on your operating system.
* A **MongoDB Atlas** database cluster (you can sign up for a free tier at mongodb.com).

### Step 1: Run the Backend Flask API Server

1. Open your terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment (highly recommended to avoid library namespace conflicts):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   * **Windows Powershell**:
     ```bash
     .\venv\Scripts\Activate.ps1
     ```
   * **macOS / Linux**:
     ```bash
     source venv/bin/activate
     ```

4. Install the backend requirements:
   ```bash
   pip install -r requirements.txt
   ```

5. Confirm the `.env` variables. Open the `backend/.env` file and verify your MongoDB connection string (`MONGO_URI`) and port definitions. You can configure a custom `JWT_SECRET` key to ensure session protection.

6. Launch the server in development mode:
   ```bash
   python app.py
   ```
   The Flask backend server will spin up on **`http://localhost:5000`** with real-time logs!

---

### Step 2: Run the Frontend React (Vite) Application

1. Open a new terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:
   ```bash
   npm install
   ```

3. Spin up the Vite local compiler dev server:
   ```bash
   npm run dev
   ```
   The dev server automatically hosts the application at **`http://localhost:5173`**! Open this address in your browser.

---

## 🔒 Security Compliance Features
* **Password Encryption**: All password credentials are automatically salted and hashed via bcrypt before insertion. Plain password records are never kept in the DB.
* **Route Guards**: Frontend views are wrapped in React route guards checking JWT validity. Unauthorized page hits are safely rerouted.
* **Token Expiration**: Signed tokens automatically expire in Letter format after 24 hours. The app automatically signs the user out to protect their session when tokens expire.
* **CORS Policies**: Explicit headers set up on the Flask server block unauthorized origins.
* **Axios Interceptor**: Outgoing API hits read and append JWT tokens safely, separating security concerns from UI components.
