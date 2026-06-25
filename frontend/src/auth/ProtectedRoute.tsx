import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/** Redirects to /login if the user has no valid token */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
