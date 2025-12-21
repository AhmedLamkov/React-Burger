import { useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import BurgerConstructor from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { clearIngredientDetails } from '../../services/ingredient-details/actions';
import { closeModal } from '../../services/modal/actions';
import { clearOrder } from '../../services/order/actions';
import IngredientDetails from '../ingredient-details/ingredient-details';
import Modal from '../modal/modal';
import OrderDetails from '../order-details/order-details';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { isOpen: isModalOpen, modalType } = useAppSelector((state) => state.modal);

  const currentIngredient = useAppSelector(
    (state) => state.ingredientDetails.ingredient
  );
  const {
    number: orderNumber,
    isLoading: isOrderLoading,
    error: orderError,
  } = useAppSelector((state) => state.order);

  const handleCloseModal = (): void => {
    void dispatch(closeModal());

    if (modalType === 'ingredientDetails') {
      void dispatch(clearIngredientDetails());
    }
    if (modalType === 'orderDetails') {
      void dispatch(clearOrder());
    }

    const background = (location.state as { background?: Location })?.background;
    if (background) {
      void navigate(background);
    }
  };

  const renderModalContent = (): React.ReactNode => {
    switch (modalType) {
      case 'ingredientDetails':
        return currentIngredient ? (
          <IngredientDetails ingredient={currentIngredient} />
        ) : (
          <div className="text text_type_main-default">Ингредиент не найден</div>
        );

      case 'orderDetails':
        return (
          <OrderDetails
            orderNumber={orderNumber ?? undefined}
            isLoading={isOrderLoading}
            error={orderError ?? undefined}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </main>

      {isModalOpen && (
        <Modal
          title={modalType === 'ingredientDetails' ? 'Детали ингредиента' : ''}
          onClose={handleCloseModal}
        >
          {renderModalContent()}
        </Modal>
      )}
    </div>
  );
};

export default App;
