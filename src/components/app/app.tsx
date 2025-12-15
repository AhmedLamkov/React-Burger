import { useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import BurgerConstructor from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import IngredientDetails from '../ingredient-details/ingredient-details';
import Modal from '../modal/modal';
import OrderDetails from '../order-details/order-details';

import type { TIngredient } from '@/utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState<boolean>(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [orderLoading, setOrderLoading] = useState<boolean>(false);

  const handleIngredientClick = (ingredient: TIngredient): void => {
    setSelectedIngredient(ingredient);
    setIsIngredientModalOpen(true);
  };

  const handleOrderClick = (): void => {
    setOrderLoading(true);
    setIsOrderModalOpen(true);

    setTimeout(() => {
      setOrderLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients onIngredientClick={handleIngredientClick} />
        <BurgerConstructor
          onOrderClick={handleOrderClick}
          isOrderLoading={orderLoading}
        />
      </main>

      {isIngredientModalOpen && selectedIngredient && (
        <Modal
          title="Детали ингредиента"
          onClose={() => setIsIngredientModalOpen(false)}
        >
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}

      {isOrderModalOpen && (
        <Modal onClose={() => setIsOrderModalOpen(false)}>
          <OrderDetails isLoading={orderLoading} />
        </Modal>
      )}
    </div>
  );
};

export default App;
