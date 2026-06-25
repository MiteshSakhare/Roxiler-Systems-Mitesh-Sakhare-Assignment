import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Group, Storefront, Star, TrendingUp, AccessTime } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
    totalOwners: 0,
    totalNormalUsers: 0,
    averagePlatformRating: 0,
    recentUsers: [] as any[],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:3000/admin/dashboard', { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <motion.div variants={itemVariants} className="material-card hover:-translate-y-1 transition-transform">
          <div className="material-card-header">
            <h3>Total Users</h3>
            <Group fontSize="large" />
          </div>
          <div className="material-card-body">
            <h2 className="text-4xl font-black text-[var(--color-text-main)] mb-2">{stats.totalUsers}</h2>
            <p className="text-sm text-[var(--color-text-muted)] font-medium">Registered accounts</p>
          </div>
        </motion.div>

        {/* Total Stores Card */}
        <motion.div variants={itemVariants} className="material-card hover:-translate-y-1 transition-transform">
          <div className="material-card-header">
            <h3>Total Stores</h3>
            <Storefront fontSize="large" />
          </div>
          <div className="material-card-body">
            <h2 className="text-4xl font-black text-[var(--color-text-main)] mb-2">{stats.totalStores}</h2>
            <p className="text-sm text-[var(--color-text-muted)] font-medium">Active storefronts</p>
          </div>
        </motion.div>

        {/* Average Rating Card */}
        <motion.div variants={itemVariants} className="material-card hover:-translate-y-1 transition-transform bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-700/30">
          <div className="material-card-header">
            <h3 className="text-amber-800 dark:text-amber-400">Avg Rating</h3>
            <Star fontSize="large" className="text-amber-500" />
          </div>
          <div className="material-card-body flex items-center justify-between">
            <div>
              <h2 className="text-5xl font-black text-amber-600 mb-2">{stats.averagePlatformRating.toFixed(1)}<span className="text-2xl text-amber-600/50">/5</span></h2>
              <p className="text-sm text-amber-700/70 font-medium">Platform average</p>
            </div>
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-800/30 rounded-full flex items-center justify-center text-amber-500">
               <TrendingUp fontSize="large" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Quick Actions & System Overview */}
        <motion.div variants={itemVariants} className="col-span-1 flex flex-col gap-6">
          <div className="material-card">
            <div className="material-card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="material-card-body space-y-3">
              <Link to="/admin/users/add" className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-light)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all group">
                <span className="font-medium text-sm">Add New User</span>
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Group fontSize="small" />
                </div>
              </Link>
              <Link to="/admin/stores/add" className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-light)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all group">
                <span className="font-medium text-sm">Add New Store</span>
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Storefront fontSize="small" />
                </div>
              </Link>
            </div>
          </div>

          <div className="material-card flex-1">
            <div className="material-card-header">
              <h3>System Overview</h3>
            </div>
            <div className="material-card-body flex flex-col justify-center space-y-4">
               <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--color-bg-light)] border border-[var(--color-border)]">
                 <span className="font-medium text-[var(--color-text-muted)]">Total Users</span>
                 <span className="font-bold text-[var(--color-primary)]">{stats.totalNormalUsers}</span>
               </div>
               <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--color-bg-light)] border border-[var(--color-border)]">
                 <span className="font-medium text-[var(--color-text-muted)]">Store Owners</span>
                 <span className="font-bold text-[var(--color-accent)]">{stats.totalOwners}</span>
               </div>
               <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--color-bg-light)] border border-[var(--color-border)]">
                 <span className="font-medium text-[var(--color-text-muted)]">Total Ratings</span>
                 <span className="font-bold text-amber-500">{stats.totalRatings}</span>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Signups */}
        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2 material-card overflow-hidden flex flex-col">
          <div className="material-card-header bg-[var(--color-bg-light)]/50 border-b border-[var(--color-border)]">
            <h3 className="flex items-center gap-2">
              <AccessTime fontSize="small" />
              Recent Signups
            </h3>
          </div>
          <div className="flex-1 overflow-auto p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-light)]/30">
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {stats.recentUsers && stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((user: any) => (
                    <tr key={user.id} className="hover:bg-[var(--color-bg-light)]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            user.role === 'ADMIN' ? 'bg-purple-500' : 
                            user.role === 'STORE_OWNER' ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-[var(--color-text-main)] text-sm">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                          user.role === 'STORE_OWNER' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-muted)] text-right">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-[var(--color-text-muted)]">No recent users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
