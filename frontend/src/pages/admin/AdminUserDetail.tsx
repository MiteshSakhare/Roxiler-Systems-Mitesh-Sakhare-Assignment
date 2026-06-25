import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../../api/userApi';
import RatingStars from '../../components/common/RatingStars';
import type { UserDetail } from '../../types';
import { motion } from 'framer-motion';

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      userApi
        .getUserDetail(parseInt(id, 10))
        .then((res) => setUser(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-lg space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="card space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-6 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-surface-700">User not found</p>
      </div>
    );
  }

  const fields = [
    { label: 'Name', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Address', value: user.address || '—' },
    { label: 'Role', value: user.role.replace('_', ' ') },
    {
      label: 'Joined',
      value: new Date(user.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => navigate('/admin/users')}
        className="text-sm text-[var(--color-primary)] hover:text-[var(--color-accent)] font-medium mb-4 inline-flex items-center gap-1"
      >
        ← Back to Users
      </button>

      <h2 className="text-3xl font-black font-['Satoshi'] text-[var(--color-primary)] mb-6">User Details</h2>

      <div className="max-w-lg">
        <div className="material-card material-card-body">
          <dl className="space-y-4">
            {fields.map((field) => (
              <div key={field.label}>
                <dt className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  {field.label}
                </dt>
                <dd className="mt-1 text-sm text-[var(--color-text-main)] font-medium">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Store owner's store info with average rating */}
        {user.role === 'STORE_OWNER' && user.store && (
          <div className="material-card material-card-body mt-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-3 border-b border-[var(--color-border)] pb-2">
              Owned Store
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Store Name
                </dt>
                <dd className="mt-1 text-sm text-[var(--color-text-main)] font-medium">{user.store.name}</dd>
              </div>
              <div className="pt-2">
                <dt className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                  Average Rating
                </dt>
                <dd className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-[var(--color-text-main)]">{Number(user.store.averageRating || 0).toFixed(1)}</span>
                  <RatingStars
                    rating={Math.round(Number(user.store.averageRating || 0))}
                    size="md"
                  />
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </motion.div>
  );
}
