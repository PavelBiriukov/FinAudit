import { Navigate, useLocation } from 'react-router-dom';
import { clientAuthTokenStorage } from '../../shared/lib/clientAuthTokenStorage';

type ProtectedClientRouteProps = {
  children: React.ReactNode;
};

export const ProtectedClientRoute = ({
  children,
}: ProtectedClientRouteProps) => {
  const location = useLocation();
  const token = clientAuthTokenStorage.getToken();

  if (!token) {
    return (
      <Navigate
        to="/client/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
};