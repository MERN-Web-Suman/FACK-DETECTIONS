import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthModalProvider } from './context/AuthModalContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AppRoutes } from './routes/AppRoutes';
import { AuthModal } from './components/common/AuthModal';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthModalProvider>
          <div className="flex flex-col min-h-screen bg-[#0a0f1d] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
            <Navbar />
            <div className="flex-1">
              <AppRoutes />
            </div>
            <Footer />
            {/* Global Auth Modal — renders on top of everything */}
            <AuthModal />
          </div>
        </AuthModalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
