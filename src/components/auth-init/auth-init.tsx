import { useEffect } from 'react';

import { getUserRequest, setAuthChecked } from '../../services/auth/actions';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

const AuthInit = (): React.JSX.Element | null => {
  const dispatch = useAppDispatch();
  const { isAuthChecked } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('AuthInit: Starting auth initialization');

    const initAuth = (): void => {
      const accessToken = localStorage.getItem('accessToken');
      console.log('AuthInit: Checking access token...', !!accessToken);

      if (accessToken) {
        console.log('AuthInit: Dispatching getUserRequest');
        dispatch(getUserRequest());
      } else {
        console.log('AuthInit: No access token, skipping user fetch');
      }

      console.log('AuthInit: Setting auth checked');
      dispatch(setAuthChecked(true));
    };

    const timer = setTimeout(() => {
      initAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [dispatch, isAuthChecked]);

  return null;
};

export default AuthInit;
