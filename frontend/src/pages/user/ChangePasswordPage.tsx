import React, { useState } from 'react';
import { authApi } from '../../api/authApi';
import { FormInput } from '../../components/common/FormInput';
import { useToast } from '../../components/common/Toast';
import { validators } from '../../utils/validators';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const { showToast, ToastComponent } = useToast();

  const updateField = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: null });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string | null> = {
      currentPassword: !form.currentPassword
        ? 'Current password is required'
        : null,
      newPassword: validators.password(form.newPassword),
      confirmPassword:
        form.newPassword !== form.confirmPassword
          ? 'Passwords do not match'
          : null,
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
      await authApi.changePassword(form.currentPassword, form.newPassword);
      showToast('Password updated successfully', 'success');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      const msg =
        err.response?.data?.message || 'Failed to change password';
      setServerError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {ToastComponent}
      <h2 className="text-3xl font-black font-['Roboto_Slab'] text-[var(--color-primary)] mb-6">Change Password</h2>

      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="material-card material-card-body" noValidate>
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {serverError}
            </div>
          )}

          <FormInput
            id="current-password"
            label="Current Password"
            type="password"
            value={form.currentPassword}
            onChange={(v) => updateField('currentPassword', v)}
            error={errors.currentPassword}
            placeholder="Enter current password"
            required
          />

          <FormInput
            id="new-password"
            label="New Password"
            type="password"
            value={form.newPassword}
            onChange={(v) => updateField('newPassword', v)}
            error={errors.newPassword}
            placeholder="8-16 chars, 1 uppercase, 1 special"
            required
          />

          <FormInput
            id="confirm-password"
            label="Confirm New Password"
            type="password"
            value={form.confirmPassword}
            onChange={(v) => updateField('confirmPassword', v)}
            error={errors.confirmPassword}
            placeholder="Re-enter new password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
