import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import BurgerConstructor from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import ForgotPasswordPage from '../../pages/forgot-password-page/forgot-password-page';
import IngredientDetailsPage from '../../pages/ingredient-details-page/ingredient-details-page';
import LoginPage from '../../pages/login-page/login-page';
import ProfilePage from '../../pages/profile-page/profile-page';
import RegisterPage from '../../pages/register-page/register-page';
import ResetPasswordPage from '../../pages/reset-password-page/reset-password-page';
import {
  setAuthChecked,
  getUserSuccess,
  getUserFailed,
} from '../../services/auth/actions';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchIngredients } from '../../services/ingredients/thunk';
import { closeModal } from '../../services/modal/actions';
import { clearOrder } from '../../services/order/actions';
import { api } from '../../utils/api';
import IngredientDetails from '../ingredient-details/ingredient-details';
import Modal from '../modal/modal';
import OrderDetails from '../order-details/order-details';
import ProtectedRoute from '../protected-route/protected-route';

import type { TIngredient } from '../../utils/types';
import type { Location } from 'react-router-dom';

import styles from './app.module.css';

type LocationState = {
  background?: Location;
};

const IngredientModal = () => {
  const { id } = useParams();
  const allIngredients = useAppSelector((state) => state.ingredients.items);
  const isLoading = useAppSelector((state) => state.ingredients.isLoading);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCloseModal = (): void => {
    const locationState = location.state as LocationState | undefined;
    const background = locationState?.background;

    if (background) {
      navigate(background.pathname, { replace: true });
    } else {
      navigate(-1);
    }
  };

  const ingredient = id
    ? allIngredients.find((item: TIngredient) => item._id === id)
    : null;

  return (
    <Modal title="Детали ингредиента" onClose={handleCloseModal}>
      {isLoading ? (
        <div className="text text_type_main-default">Загрузка...</div>
      ) : ingredient ? (
        <IngredientDetails ingredient={ingredient} />
      ) : (
        <div className="text text_type_main-default">Ингредиент не найден</div>
      )}
    </Modal>
  );
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { modalType } = useAppSelector((state) => state.modal);

  const { items: ingredients, isLoading } = useAppSelector((state) => state.ingredients);
  const {
    number: orderNumber,
    isLoading: isOrderLoading,
    error: orderError,
  } = useAppSelector((state) => state.order);

  useEffect(() => {
    if (ingredients.length === 0 && !isLoading) {
      void dispatch(fetchIngredients());
    }

    const checkUserAuth = async (): Promise<void> => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        dispatch(setAuthChecked(true));
        return;
      }

      try {
        const data = await api.getUser();
        if (data.success && data.user) {
          dispatch(getUserSuccess({ user: data.user }));
        } else {
          dispatch(
            getUserFailed(data.message ?? 'Ошибка при получении данных пользователя')
          );
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        dispatch(getUserFailed('Ошибка сервера при проверке авторизации'));
      } finally {
        dispatch(setAuthChecked(true));
      }
    };

    void checkUserAuth();
  }, [dispatch, ingredients.length, isLoading]);

  const handleCloseOrderModal = (): void => {
    void dispatch(closeModal());
    void dispatch(clearOrder());
    navigate(-1);
  };

  const locationState = location.state as LocationState | undefined;
  const background = locationState?.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background ?? location}>
        <Route
          path="/"
          element={
            <main className={`${styles.main} pl-5 pr-5`}>
              <BurgerIngredients />
              <BurgerConstructor />
            </main>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/ingredients/:id" element={<IngredientDetailsPage />} />
        <Route
          path="*"
          element={
            <div className={`${styles.notFound} mt-30`}>
              <h1 className="text text_type_main-large">404</h1>
              <p className="text text_type_main-medium mt-5">Страница не найдена</p>
            </div>
          }
        />
      </Routes>

      {background && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientModal />} />
        </Routes>
      )}

      {modalType === 'orderDetails' && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails
            orderNumber={orderNumber ?? undefined}
            isLoading={isOrderLoading}
            error={orderError ?? undefined}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
