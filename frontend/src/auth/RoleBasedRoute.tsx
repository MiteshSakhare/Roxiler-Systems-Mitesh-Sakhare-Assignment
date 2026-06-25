import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';

interface Props {
  children: React.ReactNode;
  allowedRoles: Role[];
}

/** Redirects users whose role is not in allowedRoles */
export function RoleBasedRoute({ children, allowedRoles }: Props) {
  const { role } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
