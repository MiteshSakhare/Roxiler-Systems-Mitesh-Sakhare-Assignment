import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Dashboard, Group, Storefront, VpnKey, Close } from '@mui/icons-material';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const { role } = useAuth();

  const getLinks = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { to: '/admin', label: 'Dashboard', icon: <Dashboard fontSize="small" /> },
          { to: '/admin/users', label: 'Users', icon: <Group fontSize="small" /> },
          { to: '/admin/stores', label: 'Stores', icon: <Storefront fontSize="small" /> },
        ];
      case 'STORE_OWNER':
        return [
          { to: '/owner', label: 'Dashboard', icon: <Dashboard fontSize="small" /> },
          { to: '/change-password', label: 'Change Password', icon: <VpnKey fontSize="small" /> },
        ];
      case 'NORMAL_USER':
        return [
          { to: '/user', label: 'Stores', icon: <Storefront fontSize="small" /> },
          { to: '/change-password', label: 'Change Password', icon: <VpnKey fontSize="small" /> },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`w-64 material-sidebar flex flex-col fixed inset-y-0 left-0 overflow-hidden z-50 transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between lg:justify-center py-6 px-4 lg:px-0 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <img src="/logo.png" className="w-8 h-8 object-contain" alt="RateIT Logo" />
            <span className="font-bold text-xl font-['Satoshi'] tracking-wider text-[var(--color-primary)]">RateIT</span>
          </div>
          {onClose && (
            <button className="lg:hidden text-[var(--color-text-muted)]" onClick={onClose}>
              <Close />
            </button>
          )}
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              end={link.to === '/admin' || link.to === '/owner' || link.to === '/user'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border border-transparent ${
                  isActive
                    ? 'bg-[var(--color-menu-selected)] text-[var(--color-primary)] border-[var(--color-primary)]/20 shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-light)] hover:text-[var(--color-primary)] hover:border-[var(--color-border)]'
                }`
              }
            >
              <span className="flex items-center">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
        
        <div className="p-4 border-t border-[var(--color-border)] mt-auto">
             <p className="text-xs text-[var(--color-text-muted)] text-center font-['Satoshi']">RateIT</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
