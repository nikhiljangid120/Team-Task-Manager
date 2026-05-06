"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, CheckCircle2, Clock, AlertTriangle, ListTodo } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading dashboard...</div>;

  const statCards = [
    { title: 'Total Tasks', value: stats?.total || 0, icon: <ListTodo size={24} className="gradient-text" />, color: 'var(--primary)' },
    { title: 'Pending', value: stats?.pending || 0, icon: <Clock size={24} style={{ color: 'var(--warning)' }} />, color: 'var(--warning)' },
    { title: 'In Progress', value: stats?.inProgress || 0, icon: <LayoutDashboard size={24} style={{ color: 'var(--primary)' }} />, color: 'var(--primary)' },
    { title: 'Completed', value: stats?.completed || 0, icon: <CheckCircle2 size={24} style={{ color: 'var(--success)' }} />, color: 'var(--success)' },
    { title: 'Overdue', value: stats?.overdue || 0, icon: <AlertTriangle size={24} style={{ color: 'var(--danger)' }} />, color: 'var(--danger)' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem' }}>Dashboard Overview</h1>
        <p style={{ color: '#94a3b8' }}>Here is a summary of your team's tasks.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: 'var(--radius-md)' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>{stat.title}</p>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Getting Started</h2>
        <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
          Welcome to your workspace. Use the sidebar to navigate between your projects and assigned tasks.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#94a3b8' }}>
          <li>• Check the Projects tab to see what your team is working on.</li>
          <li>• Go to the Tasks tab to update the status of your assignments.</li>
        </ul>
      </div>
    </div>
  );
}
