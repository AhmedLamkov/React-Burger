import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '../../services/hooks';

import type { ReactNode } from 'react';
import type { Location } from 'react-router-dom';

type ProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

type LocationState = {
  from?: Location;
};

const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const { isAuthenticated, isAuthChecked } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const state = location.state as LocationState | undefined;

  useEffect(() => {
    console.log('ProtectedRoute:', {
      isAuthenticated,
      isAuthChecked,
      onlyUnAuth,
      from: state?.from,
      currentPath: location.pathname,
    });
  }, [isAuthenticated, isAuthChecked, onlyUnAuth, state, location.pathname]);

  if (!isAuthChecked) {
    return (
      <div className="text text_type_main-default mt-20 text-center">
        Проверка авторизации...
      </div>
    );
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = state?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
