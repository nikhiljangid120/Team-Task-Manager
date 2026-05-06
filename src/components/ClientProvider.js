"use client";

import { AuthProvider } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function ClientProvider({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <AuthProvider>
      {isAuthPage ? (
        children
      ) : (
        <div className="app-layout">
          <Sidebar />
          <div className="main-content">
            <Navbar />
            <main style={{ padding: '2rem' }}>
              {children}
            </main>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}
