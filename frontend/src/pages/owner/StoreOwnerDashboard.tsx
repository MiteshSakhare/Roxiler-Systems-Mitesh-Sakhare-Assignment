import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosClient';
import { useAuth } from '../../hooks/useAuth';
import DataTable, { Column } from '../../components/common/DataTable';
import RatingStars from '../../components/common/RatingStars';
import { Storefront, LocationOn, Reviews } from '@mui/icons-material';
import { motion } from 'framer-motion';

const StoreOwnerDashboard: React.FC = () => {
  const { userId, token } = useAuth();
  const [store, setStore] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch unified dashboard data
        const res = await axios.get(`/store-owner/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.storeName !== 'No store assigned') {
          setStore({
            name: res.data.storeName,
            address: res.data.storeAddress || '',
            averageRating: res.data.averageRating,
          });
          setRatings(res.data.ratings);
        }
      } catch (err) {
        console.error('Failed to fetch store data', err);
      }
    };
    if (userId && token) fetchData();
  }, [userId, token]);

  const columns: Column<any>[] = [
    { key: 'userName', header: 'User Name' },
    { key: 'userEmail', header: 'Email' },
    { key: 'rating', header: 'Rating', render: (row) => <RatingStars rating={row.rating} size="sm" /> },
    { key: 'createdAt', header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() },
  ];

  if (!store) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-64 material-card rounded-2xl"
      >
        <Storefront fontSize="large" className="text-[var(--color-text-muted)] mb-4" />
        <h2 className="text-2xl font-bold text-[var(--color-text-main)]">No Store Assigned</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-2">Please contact the system administrator to assign a store to your account.</p>
      </motion.div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className="space-y-8 mt-12"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="material-card mb-12">
        <div className="material-card-header">
          <h3>Store Overview</h3>
        </div>
        <div className="material-card-body flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">{store.name}</h2>
            <p className="text-[var(--color-text-muted)] flex items-center space-x-2">
              <LocationOn fontSize="small" />
              <span>{store.address || 'No address provided'}</span>
            </p>
            <div className="mt-4 inline-flex items-center space-x-2 bg-[var(--color-bg-light)] border border-[var(--color-border)] px-3 py-1 rounded-full text-sm font-semibold text-[var(--color-primary)]">
              <Reviews fontSize="small" />
              <span>{ratings.length} total ratings</span>
            </div>
          </div>

          <div className="bg-[var(--color-bg-light)] rounded-xl p-6 border border-[var(--color-border)] text-center min-w-[200px]">
            <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Average Rating</p>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-4xl font-bold text-[var(--color-text-main)]">{Number(store.averageRating || 0).toFixed(1)}</span>
              <span className="text-xl text-[var(--color-text-muted)]">/ 5</span>
            </div>
            <div className="flex justify-center">
               <RatingStars rating={Math.round(Number(store.averageRating || 0))} size="lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="material-card">
        <div className="material-card-header">
          <h3>User Ratings</h3>
        </div>
        <div className="p-0 overflow-hidden">
          <DataTable columns={columns} data={ratings} />
        </div>
      </div>
    </motion.div>
  );
};

export default StoreOwnerDashboard;
