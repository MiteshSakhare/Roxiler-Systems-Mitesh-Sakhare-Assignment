import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex font-sans bg-[var(--color-bg-light)]">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 w-full lg:ml-64 transition-all duration-300 relative">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="max-w-7xl mx-auto p-4 lg:p-8 mt-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
