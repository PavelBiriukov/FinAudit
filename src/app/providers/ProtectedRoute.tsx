import { Navigate, useLocation } from 'react-router-dom';
import { adminAuthTokenStorage } from '../../shared/lib/adminAuthTokenStorage';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = adminAuthTokenStorage.getToken();

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
};