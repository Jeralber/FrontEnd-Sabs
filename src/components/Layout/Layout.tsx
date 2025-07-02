import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated, loading } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarOpen && <Sidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;