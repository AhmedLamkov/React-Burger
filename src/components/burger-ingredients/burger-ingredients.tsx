import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchIngredients } from '../../services/ingredients/thunk';
import IngredientCard from '../ingredient-card/ingredient-card';

import type { TIngredient } from '../../utils/types';
import type React from 'react';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients: React.FC = () => {
  const dispatch = useAppDispatch();

  const { ingredients, isLoading, error } = useAppSelector((state) => state.ingredients);

  const [currentTab, setCurrentTab] = useState<'bun' | 'sauce' | 'main'>('bun');

  const bunRef = useRef<HTMLDivElement>(null);
  const sauceRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScrollRef = useRef<() => void>(undefined);

  const buns: TIngredient[] = ingredients.filter((item) => item.type === 'bun');
  const sauces: TIngredient[] = ingredients.filter((item) => item.type === 'sauce');
  const mains: TIngredient[] = ingredients.filter((item) => item.type === 'main');

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

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
    handleScrollRef.current = (): void => {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const sectionHeight = container.scrollHeight / 3;

      if (scrollTop < sectionHeight) {
        setCurrentTab('bun');
      } else if (scrollTop < sectionHeight * 2) {
        setCurrentTab('sauce');
      } else {
        setCurrentTab('main');
      }
    };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !handleScrollRef.current) return;

    const handleScroll = (): void => handleScrollRef.current?.();

    container.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (isLoading) {
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
          Ошибка при загрузке ингредиентов
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
      <h1 className={`text text_type_main-large mt-10 mb-5`}>Соберите бургер</h1>

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
        <section ref={bunRef} className={styles.ingredients_section} data-section="bun">
          <h2 className={`text text_type_main-medium ${styles.section_title}`}>Булки</h2>
          <div className={styles.ingredients_grid}>
            {buns.map((ingredient: TIngredient) => (
              <IngredientCard key={ingredient._id} ingredient={ingredient} />
            ))}
          </div>
        </section>

        <section
          ref={sauceRef}
          className={styles.ingredients_section}
          data-section="sauce"
        >
          <h2 className={`text text_type_main-medium ${styles.section_title}`}>Соусы</h2>
          <div className={styles.ingredients_grid}>
            {sauces.map((ingredient: TIngredient) => (
              <IngredientCard key={ingredient._id} ingredient={ingredient} />
            ))}
          </div>
        </section>

        <section
          ref={mainRef}
          className={styles.ingredients_section}
          data-section="main"
        >
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
