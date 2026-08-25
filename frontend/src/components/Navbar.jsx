import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Sparkles, User, LogOut, LayoutDashboard, Route, ShieldAlert } from 'lucide-react';
import { GradientButton } from './ui/shader-button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-dark-border bg-dark-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <img
            src="/logo.png"
            alt="PathFinder AI Logo"
            className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              PathFinder <span className="gradient-text">AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">Learning Engine</span>
          </div>
        </Link>

        {/* Navigation Links */}
        {user ? (
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                isActive('/dashboard') ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-slate-300 hover:text-white hover:bg-dark-card'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/roadmap"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                isActive('/roadmap') ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-slate-300 hover:text-white hover:bg-dark-card'
              }`}
            >
              <Route className="w-4 h-4 text-cyan-400" />
              Roadmap
            </Link>
            <Link
              to="/onboarding"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                isActive('/onboarding') ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-slate-300 hover:text-white hover:bg-dark-card'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Goal Profiler
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive('/admin') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-300 hover:text-white hover:bg-dark-card'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Admin Portal
              </Link>
            )}
          </nav>
        ) : null}

        {/* Right User Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-dark-card border border-dark-border">
                <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full bg-brand-900 border border-brand-500/50" />
                <span className="text-xs font-semibold text-slate-200">{user.name}</span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-brand-500/30 text-brand-300 uppercase">{user.role}</span>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-dark-card rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2">
                Sign In
              </Link>
              <GradientButton
                variant="violet"
                onClick={() => navigate('/login')}
              >
                Start Free Journey
              </GradientButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

