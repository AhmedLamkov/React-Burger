import { IngredientsProvider } from '@/services/ingredients-context';

import { AppHeader } from '@components/app-header/app-header';
import BurgerConstructor from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  return (
    <IngredientsProvider>
      <div className={styles.app}>
        <AppHeader />
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients />
          <BurgerConstructor />
        </main>
      </div>
    </IngredientsProvider>
  );
};

export default App;
