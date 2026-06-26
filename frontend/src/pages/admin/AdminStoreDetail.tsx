import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosClient';
import { useAuth } from '../../hooks/useAuth';
import RatingStars from '../../components/common/RatingStars';
import { motion } from 'framer-motion';

export default function AdminStoreDetail() {
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (id && token) {
      axios.get(`/admin/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => setStore(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="max-w-lg space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="material-card space-y-3 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-6 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-muted)]">Store not found</p>
      </div>
    );
  }

  const fields = [
    { label: 'Name', value: store.name },
    { label: 'Email', value: store.email },
    { label: 'Address', value: store.address || '—' },
    { label: 'Owner Name', value: store.ownerName || store.owner?.name || '—' },
    { label: 'Owner Email', value: store.ownerEmail || store.owner?.email || '—' },
    {
      label: 'Created At',
      value: new Date(store.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => navigate('/admin/stores')}
        className="text-sm text-[var(--color-primary)] hover:text-[var(--color-accent)] font-medium mb-4 inline-flex items-center gap-1"
      >
        ← Back to Stores
      </button>

      <h2 className="text-3xl font-black font-['Satoshi'] text-[var(--color-primary)] mb-6">Store Details</h2>

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
            
            <div className="pt-4 border-t border-[var(--color-border)] mt-4">
                <dt className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                  Average Rating
                </dt>
                <dd className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-[var(--color-text-main)]">{Number(store.averageRating || 0).toFixed(1)}</span>
                  <RatingStars
                    rating={Math.round(Number(store.averageRating || 0))}
                    size="md"
                  />
                </dd>
            </div>
          </dl>
        </div>
      </div>
    </motion.div>
  );
}
