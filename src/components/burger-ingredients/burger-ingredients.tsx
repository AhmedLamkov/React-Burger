import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchIngredients } from '../../services/ingredients/thunk';
import IngredientCard from '../ingredient-card/ingredient-card';

import type { TIngredient } from '../../utils/types';
import type React from 'react';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // ДОБАВЬ ЭТО

  const { ingredients, isLoading, error } = useAppSelector((state) => state.ingredients);

  const [currentTab, setCurrentTab] = useState<'bun' | 'sauce' | 'main'>('bun');

  const bunRef = useRef<HTMLDivElement>(null);
  const sauceRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const buns: TIngredient[] = ingredients.filter((item) => item.type === 'bun');
  const sauces: TIngredient[] = ingredients.filter((item) => item.type === 'sauce');
  const mains: TIngredient[] = ingredients.filter((item) => item.type === 'main');

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  const handleIngredientClick = useCallback(
    (ingredient: TIngredient) => {
      navigate(`/ingredients/${ingredient._id}`, {
        state: { background: location },
      });
    },
    [navigate, location]
  );

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

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;

    const sauceTop = sauceRef.current?.offsetTop ?? 0;
    const mainTop = mainRef.current?.offsetTop ?? 0;

    let activeTab: 'bun' | 'sauce' | 'main' = 'bun';

    const threshold = 50;

    if (scrollTop < sauceTop - threshold) {
      activeTab = 'bun';
    } else if (scrollTop < mainTop - threshold) {
      activeTab = 'sauce';
    } else {
      activeTab = 'main';
    }

    if (scrollTop <= threshold) {
      activeTab = 'bun';
    }

    if (activeTab !== currentTab) {
      setCurrentTab(activeTab);
    }
  }, [currentTab]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isLoading || error || ingredients.length === 0) return;

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', throttledHandleScroll);

    handleScroll();

    return () => {
      container.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [handleScroll, isLoading, error, ingredients.length]);

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
        <section ref={bunRef} className={styles.ingredients_section}>
          <h2 className={`text text_type_main-medium ${styles.section_title}`}>Булки</h2>
          <div className={styles.ingredients_grid}>
            {buns.map((ingredient: TIngredient) => (
              <IngredientCard
                key={ingredient._id}
                ingredient={ingredient}
                onClick={() => handleIngredientClick(ingredient)}
              />
            ))}
          </div>
        </section>

        <section ref={sauceRef} className={styles.ingredients_section}>
          <h2 className={`text text_type_main-medium ${styles.section_title}`}>Соусы</h2>
          <div className={styles.ingredients_grid}>
            {sauces.map((ingredient: TIngredient) => (
              <IngredientCard
                key={ingredient._id}
                ingredient={ingredient}
                onClick={() => handleIngredientClick(ingredient)}
              />
            ))}
          </div>
        </section>

        <section ref={mainRef} className={styles.ingredients_section}>
          <h2 className={`text text_type_main-medium ${styles.section_title}`}>
            Начинки
          </h2>
          <div className={styles.ingredients_grid}>
            {mains.map((ingredient: TIngredient) => (
              <IngredientCard
                key={ingredient._id}
                ingredient={ingredient}
                onClick={() => handleIngredientClick(ingredient)}
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};
