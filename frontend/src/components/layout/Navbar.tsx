import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { DarkMode, LightMode, Logout, Menu as MenuIcon, Person, Settings, KeyboardArrowDown, AdminPanelSettings, Storefront } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { role, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleColor = (role?: string | null) => {
    switch(role) {
      case 'ADMIN': return 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20';
      case 'STORE_OWNER': return 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20';
      default: return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300 border border-gray-200 dark:border-slate-700';
    }
  };

  const getRoleLabel = (role?: string | null) => {
    switch(role) {
      case 'ADMIN': return 'Administrator';
      case 'STORE_OWNER': return 'Store Owner';
      case 'NORMAL_USER': return 'User';
      default: return 'Guest';
    }
  };

  const getRoleAvatar = () => {
    if (role === 'ADMIN') return <AdminPanelSettings />;
    if (role === 'STORE_OWNER') return <Storefront />;
    return <Person />;
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 h-16 flex items-center justify-between px-6 bg-[var(--color-bg-navbar)]/75 backdrop-blur-xl shadow-sm border-b border-[var(--color-border)] w-full"
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-colors p-2 rounded-full hover:bg-[var(--color-bg-light)]"
        >
           <MenuIcon />
        </button>
        <div className="flex flex-col hidden md:flex">
          <span className="text-xs text-[var(--color-text-muted)] font-medium tracking-wide uppercase">Pages / <span className="text-[var(--color-primary)]">Dashboard</span></span>
          <h6 className="font-bold text-[var(--color-text-main)] text-xl m-0 tracking-tight">Overview</h6>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className={`hidden md:block px-4 py-1.5 rounded-full text-xs font-bold ${getRoleColor(role)} shadow-sm`}>
          {getRoleLabel(role)}
        </div>
        
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all"
          title="Toggle Theme"
        >
          {theme === 'light' ? <DarkMode /> : <LightMode />}
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 p-1 pr-3 rounded-full hover:bg-[var(--color-bg-light)] transition-all border border-transparent hover:border-[var(--color-border)]"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md text-white ${
              role === 'ADMIN' ? 'bg-gradient-to-tr from-purple-600 to-indigo-400' :
              role === 'STORE_OWNER' ? 'bg-gradient-to-tr from-[var(--color-accent)] to-orange-400' :
              'bg-gradient-to-tr from-[var(--color-primary)] to-blue-400'
            }`}>
              {getRoleAvatar()}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-bold text-[var(--color-text-main)] leading-none">{user?.name || 'User'}</span>
            </div>
            <KeyboardArrowDown className={`text-[var(--color-text-muted)] transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} fontSize="small" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-xl py-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-[var(--color-border)] mb-2">
                  <p className="text-sm font-bold text-[var(--color-text-main)] truncate">{user?.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
                </div>
                
                <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center space-x-3 px-4 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-bg-light)] hover:text-[var(--color-primary)] transition-colors">
                  <Person fontSize="small" />
                  <span>View Profile</span>
                </Link>

                <Link to="/change-password" onClick={() => setProfileOpen(false)} className="flex items-center space-x-3 px-4 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-bg-light)] hover:text-[var(--color-primary)] transition-colors">
                  <Settings fontSize="small" />
                  <span>Change Password</span>
                </Link>

                <button 
                  onClick={() => { setProfileOpen(false); logout(); }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <Logout fontSize="small" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
