import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PathProvider } from './context/PathContext';

import Navbar from './components/Navbar';
import AIOrb from './components/AIOrb';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import RoadmapPage from './pages/RoadmapPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-cyan-400 font-bold text-sm">
        PathFinder AI Initializing...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <PathProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100 font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/roadmap" element={
                  <ProtectedRoute>
                    <RoadmapPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Context-aware Floating AI Orb */}
            <AIOrb />

            {/* Footer */}
            <footer className="glass-card border-t border-dark-border py-6 text-center text-xs text-slate-500">
              <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
                <span>PathFinder AI © 2026. "Learn what matters. In the right order."</span>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-cyan-300">Privacy Policy</a>
                  <a href="#" className="hover:text-cyan-300">API Documentation</a>
                  <a href="#" className="hover:text-cyan-300">System Architecture</a>
                </div>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </PathProvider>
    </AuthProvider>
  );
}
