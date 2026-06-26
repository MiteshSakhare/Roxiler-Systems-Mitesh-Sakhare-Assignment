import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosClient';
import { Link, useNavigate } from 'react-router-dom';
import DataTable, { Column } from '../../components/common/DataTable';
import { FormInput } from '../../components/common/FormInput';
import { Add, ChevronRight } from '@mui/icons-material';
import { motion } from 'framer-motion';

const AdminUsersList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  
  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('ASC');

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/admin/users?sortBy=${sortBy}&sortOrder=${sortOrder}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortBy, sortOrder]);

  useEffect(() => {
    let result = users;
    if (nameFilter) result = result.filter(u => u.name.toLowerCase().includes(nameFilter.toLowerCase()));
    if (emailFilter) result = result.filter(u => u.email.toLowerCase().includes(emailFilter.toLowerCase()));
    if (addressFilter) result = result.filter(u => u.address?.toLowerCase().includes(addressFilter.toLowerCase()));
    if (roleFilter) result = result.filter(u => u.role === roleFilter);
    setFilteredUsers(result);
  }, [nameFilter, emailFilter, addressFilter, roleFilter, users]);

  const columns: Column<any>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'address', header: 'Address' },
    { 
      key: 'role', 
      header: 'Role',
      render: (row) => {
        let bg = 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-gray-100';
        if (row.role === 'ADMIN') bg = 'bg-[var(--color-primary)] text-white';
        if (row.role === 'STORE_OWNER') bg = 'bg-[var(--color-accent)] text-white';
        if (row.role === 'NORMAL_USER') bg = 'bg-[var(--color-bg-light)] text-[var(--color-text-main)] border border-[var(--color-border)]';
        const formattedRole = row.role === 'STORE_OWNER' ? 'Store Owner' : row.role === 'NORMAL_USER' ? 'User' : 'Admin';
        return <span className={`px-2 py-1 rounded text-xs font-semibold ${bg}`}>{formattedRole}</span>;
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button 
          onClick={() => navigate(`/admin/users/${row.id}`)}
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
        <h1 className="text-3xl font-black font-['Satoshi'] text-[var(--color-primary)]">Users</h1>
        <Link to="/admin/users/add" className="btn-primary flex items-center space-x-2">
          <Add fontSize="small" />
          <span>Add User</span>
        </Link>
      </div>

      <div className="material-card">
        <div className="material-card-header">
          <h3>Filters</h3>
        </div>
        <div className="material-card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <FormInput id="name" label="Name" value={nameFilter} onChange={(val) => setNameFilter(val)} />
            <FormInput id="email" label="Email" value={emailFilter} onChange={(val) => setEmailFilter(val)} />
            <FormInput id="address" label="Address" value={addressFilter} onChange={(val) => setAddressFilter(val)} />
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">Role</label>
              <select 
                className="input-field" 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="" className="bg-[var(--color-bg-card)] text-[var(--color-text-main)]">All Roles</option>
                <option value="ADMIN" className="bg-[var(--color-bg-card)] text-[var(--color-text-main)]">Admin</option>
                <option value="NORMAL_USER" className="bg-[var(--color-bg-card)] text-[var(--color-text-main)]">User</option>
                <option value="STORE_OWNER" className="bg-[var(--color-bg-card)] text-[var(--color-text-main)]">Store Owner</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={() => {
                setNameFilter('');
                setEmailFilter('');
                setAddressFilter('');
                setRoleFilter('');
              }}
              className="px-5 py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              Clear
            </button>
            <button 
              onClick={() => { /* Triggered already by effects, but gives visual feedback */ }} 
              className="btn-primary"
            >
              Search Users
            </button>
          </div>
        </div>
      </div>

      <div className="material-card">
        <div className="material-card-header">
          <h3>Users List</h3>
        </div>
        <div className="p-0 overflow-hidden">
          <DataTable 
            columns={columns} 
            data={filteredUsers} 
            onSort={(key, dir) => {
              setSortBy(key);
              setSortOrder(dir.toUpperCase());
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AdminUsersList;
