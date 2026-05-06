"use client";

import { useAuth } from '@/context/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar justify-between">
      <div>
        <h3 style={{ margin: 0, fontWeight: 500 }}>Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋</h3>
      </div>
      
      <div className="flex items-center gap-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--glass-border)' }}>
          <User size={16} className="gradient-text" />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.role}</span>
        </div>
        
        <button 
          onClick={logout}
          className="btn btn-secondary"
          style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)' }}
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
