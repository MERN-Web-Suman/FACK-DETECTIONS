import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Search,
  History,
  User,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { name: 'Dashboard Overview', path: '/user/dashboard', icon: LayoutDashboard },
    { name: 'Live URL Scanner', path: '/scanner', icon: Search },
    { name: 'My Scan History', path: '/user/history', icon: History },
    { name: 'Profile Settings', path: '/user/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shrink-0 hidden md:flex">
      <div className="space-y-6">

        {/* Header Badge */}
        <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              User Console
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/user/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 shadow-sm shadow-cyan-900/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer Card */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/30"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate font-mono">{user?.email}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
