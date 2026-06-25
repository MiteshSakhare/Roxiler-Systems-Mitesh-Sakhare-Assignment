import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import DataTable, { Column } from '../../components/common/DataTable';
import { FormInput } from '../../components/common/FormInput';
import { Add, ChevronRight, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';

const AdminStoresList: React.FC = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<any[]>([]);
  const [filteredStores, setFilteredStores] = useState<any[]>([]);
  
  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('ASC');

  const fetchStores = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/admin/stores?sortBy=${sortBy}&sortOrder=${sortOrder}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStores(res.data);
      setFilteredStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores', err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [sortBy, sortOrder]);

  useEffect(() => {
    let result = stores;
    if (nameFilter) result = result.filter(s => s.name.toLowerCase().includes(nameFilter.toLowerCase()));
    if (emailFilter) result = result.filter(s => s.email.toLowerCase().includes(emailFilter.toLowerCase()));
    if (addressFilter) result = result.filter(s => s.address?.toLowerCase().includes(addressFilter.toLowerCase()));
    
    setFilteredStores(result);
  }, [nameFilter, emailFilter, addressFilter, stores]);

  const getRatingBadgeClass = (rating: number) => {
    if (rating >= 4) return 'bg-[var(--color-badge-green)] text-white';
    if (rating >= 2.5) return 'bg-[var(--color-badge-yellow)] text-white';
    return 'bg-[var(--color-badge-red)] text-white';
  };

  const columns: Column<any>[] = [
    { key: 'name', header: 'Store Name' },
    { key: 'email', header: 'Email' },
    { key: 'address', header: 'Address' },
    { key: 'owner_name', header: 'Owner Name', render: (row) => row.ownerName || row.owner?.name || '—' },
    { key: 'owner_email', header: 'Owner Email', render: (row) => row.ownerEmail || row.owner?.email || '—' },
    { key: 'average_rating', header: 'Avg Rating', render: (row) => {
      const rating = row.averageRating ? Number(row.averageRating) : 0;
      return (
        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-bold ${getRatingBadgeClass(rating)}`}>
          <span>{rating > 0 ? rating.toFixed(1) : 'N/A'}</span>
          <Star fontSize="inherit" />
        </div>
      );
    }},
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button 
          onClick={() => navigate(`/admin/stores/${row.id}`)}
          className="text-[var(--color-primary)] hover:text-[var(--color-accent)] text-sm font-medium flex items-center"
        >
          <span>View</span>
          <ChevronRight fontSize="small" />
        </button>
      )
    }
  ];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black font-['Satoshi'] text-[var(--color-primary)]">Stores</h1>
        <Link to="/admin/stores/add" className="btn-primary flex items-center space-x-2">
          <Add fontSize="small" />
          <span>Add Store</span>
        </Link>
      </div>

      <div className="material-card">
        <div className="material-card-header">
          <h3>Filters</h3>
        </div>
        <div className="material-card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <FormInput id="name" label="Store Name" value={nameFilter} onChange={(val) => setNameFilter(val)} />
            <FormInput id="email" label="Email" value={emailFilter} onChange={(val) => setEmailFilter(val)} />
            <FormInput id="address" label="Address" value={addressFilter} onChange={(val) => setAddressFilter(val)} />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={() => {
                setNameFilter('');
                setEmailFilter('');
                setAddressFilter('');
              }}
              className="px-5 py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              Clear
            </button>
            <button 
              onClick={() => { /* Filters apply via useEffect automatically */ }} 
              className="btn-primary"
            >
              Search Stores
            </button>
          </div>
        </div>
      </div>

      <div className="material-card">
        <div className="material-card-header">
          <h3>Stores List</h3>
        </div>
        <div className="p-0 overflow-hidden">
          <DataTable 
            columns={columns} 
            data={filteredStores} 
            onSort={(key, dir) => {
              setSortBy(key === 'average_rating' ? 'averageRating' : key);
              setSortOrder(dir.toUpperCase());
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AdminStoresList;
