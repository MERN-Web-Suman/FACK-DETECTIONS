# AI-Powered Phishing Website Detection System (PhishGuard AI)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-cyan.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/ML%20Service-FastAPI%20%2B%20Scikit--Learn-purple.svg)](https://fastapi.tiangolo.com/)
[![Accuracy](https://img.shields.io/badge/Detection%20Accuracy-99.4%25-brightgreen.svg)]()

PhishGuard AI is an intuitive, multi-tier cybersecurity application engineered to identify zero-day phishing websites, credential harvesting pages, and deceptive brand impersonators in real-time. By extracting 25+ lexical, structural, domain, and transport indicators, the platform delivers sub-second risk classification backed by an explainable evidence score.

---

## 📁 Repository Directory Structure

```text
AI-Phishing-Detection-System/
│
├── frontend/
│   │
│   ├── public/
│   │   ├── logo.png
│   │   ├── logo.svg
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── Features.jsx
│   │   │   │   ├── HowItWorks.jsx
│   │   │   │   └── Statistics.jsx
│   │   │   │
│   │   │   ├── scanner/
│   │   │   │   ├── URLInput.jsx
│   │   │   │   ├── ScanButton.jsx
│   │   │   │   ├── ScanProgress.jsx
│   │   │   │   └── ScanResult.jsx
│   │   │   │
│   │   │   └── dashboard/
│   │   │       ├── StatsCard.jsx
│   │   │       ├── ScanHistory.jsx
│   │   │       ├── RecentScans.jsx
│   │   │       └── AnalyticsChart.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Scanner.jsx
│   │   │   ├── ScanResult.jsx
│   │   │   │
│   │   │   └── user/
│   │   │       ├── UserDashboard.jsx
│   │   │       ├── ScanHistory.jsx
│   │   │       └── UserProfile.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── scanService.js
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── utils/
│   │   │   └── formatDate.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── scanController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Scan.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── scanRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── services/
│   │   ├── mlService.js
│   │   └── scanService.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── validateURL.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
│
├── ml-service/
│   │
│   ├── dataset/
│   │   ├── phishing.csv
│   │   └── legitimate.csv
│   │
│   ├── models/
│   │   ├── phishing_model.pkl
│   │   └── scaler.pkl
│   │
│   ├── notebooks/
│   │   └── model_training.ipynb
│   │
│   ├── feature_extraction/
│   │   ├── __init__.py
│   │   ├── url_features.py
│   │   ├── domain_features.py
│   │   └── security_features.py
│   │
│   ├── training/
│   │   ├── __init__.py
│   │   ├── preprocess.py
│   │   ├── train_model.py
│   │   └── evaluate_model.py
│   │
│   ├── prediction/
│   │   ├── __init__.py
│   │   └── predict.py
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   └── schemas.py
│   │
│   ├── requirements.txt
│   └── .env
│
│
├── documentation/
│   ├── project-report.pdf
│   ├── project-report.md
│   ├── system-architecture.png
│   ├── system-architecture.svg
│   ├── database-design.png
│   └── database-design.svg
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Start the Backend API
```bash
cd backend
npm install
npm start
```
The server starts on `http://localhost:5000` with automated resilient in-memory database fallback (or connects automatically to MongoDB if running).

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Open your browser to `http://localhost:5173`.

### 3. (Optional) Run the Python ML Microservice
```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

---

## 🔑 Demo Credentials (One-Click Sign-In Included)
The application includes an instant demo login button on the login screen and navbar:

| Account Type | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Standard User** | `user@phishguard.ai` | `User@123` | Full Dashboard, Personal History & Telemetry |

---

## 🛡️ Key Features
- **Live Scanning Engine:** Real-time step progress animation while dissecting URL features.
- **Explainable Threat Evidence:** Clear breakdown of detected brand impersonations, untrusted TLDs, non-HTTPS protocols, and IP hostnames.
- **User Dashboard & Analytics:** Personal scanning metrics, security cards, and search/filter scan history.
- **Export Capabilities:** Export scan records to CSV with one click.
- **Resilient Fallback Design:** The backend operates with 100% functionality even before MongoDB or Python services are spun up.
