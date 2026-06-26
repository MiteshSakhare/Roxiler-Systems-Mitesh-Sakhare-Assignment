import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosClient';
import { useAuth } from '../../hooks/useAuth';
import RatingStars from '../../components/common/RatingStars';
import { Search, LocationOn, Storefront, SearchOff } from '@mui/icons-material';
import { motion } from 'framer-motion';

const UserStoresList: React.FC = () => {
  const { userId, token } = useAuth();
  const [stores, setStores] = useState<any[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  const fetchStoresAndRatings = async () => {
    try {
      const storesRes = await axios.get('/stores', { headers: { Authorization: `Bearer ${token}` } });
      setStores(storesRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    if (userId && token) fetchStoresAndRatings();
  }, [userId, token]);

  const handleRatingChange = async (storeId: number, newRating: number) => {
    try {
      await axios.post(`/stores/${storeId}/rating`, {
        rating: newRating
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh to get updated averages and my rating
      fetchStoresAndRatings();
    } catch (err) {
      console.error('Failed to submit rating', err);
    }
  };

  const filteredStores = stores.filter(s => {
    const matchName = s.name.toLowerCase().includes(searchName.toLowerCase());
    const matchAddr = s.address?.toLowerCase().includes(searchAddress.toLowerCase()) ?? true;
    return matchName && matchAddr;
  });

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
      className="space-y-8 mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black font-['Satoshi'] text-[var(--color-primary)]">Stores</h1>
      </div>

      <div className="material-card mb-12">
        <div className="material-card-header">
          <h3>Search Stores</h3>
        </div>
        <div className="material-card-body flex flex-col md:flex-row gap-6">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] flex items-center">
              <Search fontSize="small" />
            </div>
            <input 
              type="text" 
              placeholder="Search by store name..." 
              className="input-field pl-10"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] flex items-center">
              <LocationOn fontSize="small" />
            </div>
            <input 
              type="text" 
              placeholder="Search by address..." 
              className="input-field pl-10"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredStores.map(store => {
          return (
            <motion.div variants={itemVariants} key={store.id} className="material-card group hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full">
              <div className="material-card-header !p-4 !bg-[var(--color-bg-light)] border-b border-[var(--color-border)]">
                <Storefront fontSize="large" className="text-[var(--color-primary)]" />
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-accent)] transition-colors">{store.name}</h3>
                <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 h-10 mb-4">{store.address}</p>
                
                <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Average Rating</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-[var(--color-text-main)]">{Number(store.averageRating || 0).toFixed(1)}</span>
                    <RatingStars rating={Math.round(Number(store.averageRating || 0))} size="sm" />
                  </div>
                </div>
              </div>
              
              <div className="bg-[var(--color-bg-light)] p-4 border-t border-[var(--color-border)] flex items-center justify-between rounded-b-xl">
                <span className="text-sm font-semibold text-[var(--color-text-main)]">Your Rating</span>
                <RatingStars 
                  rating={store.userRating || 0} 
                  interactive={true} 
                  onRatingChange={(newRating) => handleRatingChange(store.id, newRating)}
                  size="md"
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {filteredStores.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center text-[var(--color-text-muted)]"
        >
          <SearchOff fontSize="large" className="mb-4 opacity-50" style={{ fontSize: 48 }} />
          <p className="text-lg">No stores found matching your search.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserStoresList;
