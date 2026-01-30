import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '../../services/hooks';

import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

type LocationState = {
  from?: {
    pathname: string;
  };
};

const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const { isAuthenticated, isAuthChecked } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const state = location.state as LocationState | undefined;
  const from = state?.from?.pathname ?? '/';

  useEffect(() => {
    console.log('ProtectedRoute debug:', {
      isAuthenticated,
      isAuthChecked,
      onlyUnAuth,
      from,
      currentPath: location.pathname,
    });
  }, [isAuthenticated, isAuthChecked, onlyUnAuth, from, location.pathname]);

  if (!isAuthChecked) {
    return (
      <div className="text text_type_main-default mt-20 text-center">Загрузка...</div>
    );
  }

  if (onlyUnAuth && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
