import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeApi } from '../../api/storeApi';
import { userApi } from '../../api/userApi';
import { FormInput } from '../../components/common/FormInput';
import { useToast } from '../../components/common/Toast';
import { validators } from '../../utils/validators';
import type { User } from '../../types';
import { motion } from 'framer-motion';
import { ExpandMore } from '@mui/icons-material';

export default function AdminAddStore() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [storeOwners, setStoreOwners] = useState<User[]>([]);
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  // Fetch store owners for the dropdown
  useEffect(() => {
    userApi
      .getUsers({ role: 'STORE_OWNER' })
      .then((res) => setStoreOwners(res.data))
      .catch(console.error);
  }, []);

  const updateField = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: null });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string | null> = {
      name: validators.name(form.name),
      email: validators.email(form.email),
      address: validators.address(form.address),
      ownerId: !form.ownerId ? 'Store owner is required' : null,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await storeApi.createStore({
        name: form.name,
        email: form.email,
        address: form.address,
        ownerId: parseInt(form.ownerId, 10),
      });
      showToast('Store created successfully', 'success');
      setTimeout(() => navigate('/admin/stores'), 1000);
    } catch (err: any) {
      const msg =
        err.response?.data?.message || 'Failed to create store';
      setServerError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {ToastComponent}
      <h2 className="text-3xl font-black font-['Satoshi'] text-[var(--color-primary)] mb-6">Add New Store</h2>

      <div className="max-w-lg">
        <form onSubmit={handleSubmit} className="material-card material-card-body" noValidate>
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div className="space-y-5">
            <FormInput
              id="add-store-name"
              label="Store Name"
              value={form.name}
              onChange={(v) => updateField('name', v)}
              error={errors.name}
              placeholder="Min. 20 characters"
              required
            />

            <FormInput
              id="add-store-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => updateField('email', v)}
              error={errors.email}
              placeholder="store@example.com"
              required
            />

            <FormInput
              id="add-store-address"
              label="Address"
              value={form.address}
              onChange={(v) => updateField('address', v)}
              error={errors.address}
              placeholder="Store address"
            />

            <div className="relative">
              <label
                htmlFor="add-store-owner"
                className="block text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2"
              >
                Store Owner <span className="text-red-500">*</span>
              </label>
              <select
                id="add-store-owner"
                value={form.ownerId}
                onChange={(e) => updateField('ownerId', e.target.value)}
                className={`w-full px-4 py-3 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-main)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all appearance-none ${errors.ownerId ? 'border-red-400' : ''}`}
              >
                <option value="" className="bg-[var(--color-bg-card)] text-[var(--color-text-main)]">Select a store owner...</option>
                {storeOwners.map((owner) => (
                  <option key={owner.id} value={owner.id} className="bg-[var(--color-bg-card)] text-[var(--color-text-main)]">
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-7 text-[var(--color-text-muted)]">
                <ExpandMore />
              </div>
              {errors.ownerId && (
                <p className="mt-1 text-sm text-red-500">{errors.ownerId}</p>
              )}
              {storeOwners.length === 0 && (
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  No store owners found. Create a user with the Store Owner role
                  first.
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-[var(--color-border)]">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3 text-base"
            >
              {loading ? 'Creating Store...' : 'Create Store'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/stores')}
              className="btn-secondary !bg-gray-500 hover:!bg-gray-600 flex-1 py-3 text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
