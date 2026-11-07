import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuthModal } from '../../context/AuthModalContext';
import {
  ShieldCheck,
  Search,
  LayoutDashboard,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-200">
                  PhishGuard
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-mono">Neural Threat Defense</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              Home
            </Link>
            <Link
              to="/scanner"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${isActive('/scanner') ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <Search className="w-4 h-4 text-cyan-400" />
              Scanner
            </Link>

            {isAuthenticated && (
              <Link
                to="/user/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${location.pathname.startsWith('/user') ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all hover:shadow-cyan-500/35"
              >
                Get Started
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/user/profile"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/40"
                  />
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-200 leading-tight">{user.name}</p>
                    <span className="text-[10px] text-cyan-400 font-mono">Member</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 transition-all"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/scanner"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-cyan-400 hover:bg-slate-800"
          >
            Live Scanner
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/user/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-blue-400 hover:bg-slate-800"
              >
                User Dashboard
              </Link>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-sm text-slate-300">{user.email}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs px-3 py-1.5 text-rose-400 bg-rose-950/40 rounded-lg"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('signup');
                }}
                className="block w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
