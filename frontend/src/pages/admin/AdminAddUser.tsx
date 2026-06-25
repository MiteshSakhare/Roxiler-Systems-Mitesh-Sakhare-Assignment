import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/userApi';
import { FormInput } from '../../components/common/FormInput';
import { useToast } from '../../components/common/Toast';
import { validators } from '../../utils/validators';
import { motion } from 'framer-motion';
import { ExpandMore } from '@mui/icons-material';

export default function AdminAddUser() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'NORMAL_USER',
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const updateField = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: null });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string | null> = {
      name: validators.name(form.name),
      email: validators.email(form.email),
      password: validators.password(form.password),
      address: validators.address(form.address),
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
      await userApi.createUser(form);
      showToast('User created successfully', 'success');
      setTimeout(() => navigate('/admin/users'), 1000);
    } catch (err: any) {
      const msg =
        err.response?.data?.message || 'Failed to create user';
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
      <h2 className="text-3xl font-black font-['Satoshi'] text-[var(--color-primary)] mb-6">Add New User</h2>

      <div className="max-w-lg">
        <form onSubmit={handleSubmit} className="material-card material-card-body" noValidate>
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div className="space-y-5">
            <FormInput
              id="add-user-name"
              label="Full Name"
              value={form.name}
              onChange={(v) => updateField('name', v)}
              error={errors.name}
              placeholder="Min. 20 characters"
              required
            />

            <FormInput
              id="add-user-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => updateField('email', v)}
              error={errors.email}
              placeholder="user@example.com"
              required
            />

            <FormInput
              id="add-user-password"
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => updateField('password', v)}
              error={errors.password}
              placeholder="8-16 chars, 1 uppercase, 1 special"
              required
            />

            <FormInput
              id="add-user-address"
              label="Address"
              value={form.address}
              onChange={(v) => updateField('address', v)}
              error={errors.address}
              placeholder="User address"
            />

            <div className="relative">
              <label
                htmlFor="add-user-role"
                className="block text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2"
              >
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="add-user-role"
                value={form.role}
                onChange={(e) => updateField('role', e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-main)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all appearance-none"
              >
                <option value="NORMAL_USER" className="bg-[var(--color-bg-card)] text-[var(--color-text-main)]">User</option>
                <option value="ADMIN" className="bg-[var(--color-bg-card)] text-[var(--color-text-main)]">Administrator</option>
                <option value="STORE_OWNER" className="bg-[var(--color-bg-card)] text-[var(--color-text-main)]">Store Owner</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-7 text-[var(--color-text-muted)]">
                <ExpandMore />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-[var(--color-border)]">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3 text-base"
            >
              {loading ? 'Creating User...' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="btn-secondary !bg-gray-500 hover:!bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
