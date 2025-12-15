import { useIngredients } from '@/services/ingredients-context';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';

import IngredientCard from '../ingredient-card/ingredient-card';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = (): React.JSX.Element => {
  const { ingredients, loading, error } = useIngredients();
  const [currentTab, setCurrentTab] = useState<'bun' | 'sauce' | 'main'>('bun');

  const bunRef = useRef<HTMLDivElement>(null);
  const sauceRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const buns: TIngredient[] =
    ingredients?.filter((item: TIngredient) => item.type === 'bun') ?? [];
  const sauces: TIngredient[] =
    ingredients?.filter((item: TIngredient) => item.type === 'sauce') ?? [];
  const mains: TIngredient[] =
    ingredients?.filter((item: TIngredient) => item.type === 'main') ?? [];

  const handleTabClick = (value: string): void => {
    const tabValue = value as 'bun' | 'sauce' | 'main';
    setCurrentTab(tabValue);

    switch (tabValue) {
      case 'bun':
        bunRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'sauce':
        sauceRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'main':
        mainRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = (): void => {
      const containerTop = container.getBoundingClientRect().top;
      const bunTop = bunRef.current?.getBoundingClientRect().top ?? 0;
      const sauceTop = sauceRef.current?.getBoundingClientRect().top ?? 0;
      const mainTop = mainRef.current?.getBoundingClientRect().top ?? 0;

      const distances = {
        bun: Math.abs(bunTop - containerTop),
        sauce: Math.abs(sauceTop - containerTop),
        main: Math.abs(mainTop - containerTop),
      };

      const closest = Object.entries(distances).reduce((prev, curr) =>
        curr[1] < prev[1] ? curr : prev
      );

      setCurrentTab(closest[0] as 'bun' | 'sauce' | 'main');
    };

    container.addEventListener('scroll', handleScroll);
    return (): void => container.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <section className={styles.burger_ingredients}>
        <div className="text text_type_main-default">Загрузка ингредиентов...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.burger_ingredients}>
        <div className="text text_type_main-default" style={{ color: '#E52B1A' }}>
          Ошибка при загрузке ингредиентов: {error}
        </div>
      </section>
    );
  }

  if (!ingredients || ingredients.length === 0) {
    return (
      <section className={styles.burger_ingredients}>
        <div className="text text_type_main-default text_color_inactive">
          Нет доступных ингредиентов
        </div>
      </section>
    );
  }

  return (
    <section className={styles.burger_ingredients}>
      <nav className={styles.tabs_navigation}>
        <Tab value="bun" active={currentTab === 'bun'} onClick={handleTabClick}>
          Булки
        </Tab>
        <Tab value="sauce" active={currentTab === 'sauce'} onClick={handleTabClick}>
          Соусы
        </Tab>
        <Tab value="main" active={currentTab === 'main'} onClick={handleTabClick}>
          Начинки
        </Tab>
      </nav>

      <div ref={containerRef} className={styles.ingredients_container}>
        <section ref={bunRef} className={styles.ingredients_section}>
          <h2 className={`text text_type_main-medium ${styles.section_title}`}>Булки</h2>
          <div className={styles.ingredients_grid}>
            {buns.map((ingredient: TIngredient) => (
              <IngredientCard key={ingredient._id} ingredient={ingredient} />
            ))}
          </div>
        </section>

        <section ref={sauceRef} className={styles.ingredients_section}>
          <h2 className={`text text_type_main-medium ${styles.section_title}`}>Соусы</h2>
          <div className={styles.ingredients_grid}>
            {sauces.map((ingredient: TIngredient) => (
              <IngredientCard key={ingredient._id} ingredient={ingredient} />
            ))}
          </div>
        </section>

        <section ref={mainRef} className={styles.ingredients_section}>
          <h2 className={`text text_type_main-medium ${styles.section_title}`}>
            Начинки
          </h2>
          <div className={styles.ingredients_grid}>
            {mains.map((ingredient: TIngredient) => (
              <IngredientCard key={ingredient._id} ingredient={ingredient} />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};
