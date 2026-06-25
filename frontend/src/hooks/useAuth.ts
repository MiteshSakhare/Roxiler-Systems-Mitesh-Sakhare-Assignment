import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

/** Convenience hook to access the auth context */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
