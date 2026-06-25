import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Person, Email, Badge, AdminPanelSettings, Storefront } from '@mui/icons-material';

const ProfilePage: React.FC = () => {
  const { user, role } = useAuth();

  const getRoleLabel = (role: string | null) => {
    switch(role) {
      case 'ADMIN': return 'Administrator';
      case 'STORE_OWNER': return 'Store Owner';
      case 'NORMAL_USER': return 'User';
      default: return 'Guest';
    }
  };

  const getRoleAvatar = () => {
    if (role === 'ADMIN') return <AdminPanelSettings fontSize="large" />;
    if (role === 'STORE_OWNER') return <Storefront fontSize="large" />;
    return <Person fontSize="large" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mt-12 space-y-8"
    >
      <div className="flex items-center space-x-4 mb-8">
        <div className={`w-20 h-20 rounded-full text-white flex items-center justify-center shadow-md ${
          role === 'ADMIN' ? 'bg-gradient-to-tr from-purple-600 to-indigo-400' :
          role === 'STORE_OWNER' ? 'bg-gradient-to-tr from-[var(--color-accent)] to-orange-400' :
          'bg-gradient-to-tr from-[var(--color-primary)] to-blue-400'
        }`}>
          {getRoleAvatar()}
        </div>
        <div>
          <h1 className="text-3xl font-black font-['Satoshi'] text-[var(--color-text-main)] m-0">
            {user?.name || 'User Profile'}
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1 font-medium">Manage your account details</p>
        </div>
      </div>

      <div className="material-card">
        <div className="material-card-header border-b border-[var(--color-border)] mb-4">
          <h3>Personal Information</h3>
        </div>
        <div className="material-card-body space-y-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-[var(--color-bg-light)] text-[var(--color-text-muted)]">
              <Person />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Full Name</p>
              <p className="text-[var(--color-text-main)] font-medium text-lg">{user?.name || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-[var(--color-bg-light)] text-[var(--color-text-muted)]">
              <Email />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Email Address</p>
              <p className="text-[var(--color-text-main)] font-medium text-lg">{user?.email || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-[var(--color-bg-light)] text-[var(--color-text-muted)]">
              <Badge />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Account Role</p>
              <div className="mt-1">
                <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full">
                  {getRoleLabel(role)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
