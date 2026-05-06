"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, Users } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
  ];

  if (user?.role === 'Admin') {
    // Admins could have a users management page, but we'll keep it simple
    // links.push({ name: 'Team Members', path: '/team', icon: <Users size={20} /> });
  }

  return (
    <aside className="sidebar" style={{ padding: '2rem 0' }}>
      <div style={{ padding: '0 2rem', marginBottom: '2rem' }}>
        <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckSquare className="gradient-text" />
          Ethara Task
        </h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
        {links.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link 
              href={link.path} 
              key={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'white' : '#cbd5e1',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                transition: 'var(--transition)',
                fontWeight: isActive ? 500 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--secondary-hover)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#cbd5e1';
                }
              }}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
