const SELECTORS = {
  ingredientCard: '[class*="ingredient_card"]',
  modal: '[data-testid=modal]',
  modalCloseButton: '[data-testid=modal-close-button]',
  modalOverlay: '[data-testid=modal-overlay]',
  constructorSection: '[data-testid=burger-constructor-section]',
  bunTop: '[data-testid=constructor-bun-top-container]',
  bunBottom: '[data-testid=constructor-bun-bottom-container]',
  ingredientsContainer: '[data-testid=constructor-ingredients-container]',
  ingredientItem: '[class*="item"]',
  totalPrice: '[data-testid=constructor-total-price]',
  orderButton: '[data-testid=constructor-order-button]',
  emailInput: '[data-testid=email-input]',
  passwordInput: '[data-testid=password-input]',
  loginSubmitButton: '[data-testid=login-submit-button]',
  orderNumber: '[data-testid=order-number]',
  ingredientDetails: '[data-testid=ingredient-details]',
} as const;

const TEST_USER = {
  email: 'test@test.com',
  password: 'password123',
  name: 'Test User',
} as const;

const TEST_INGREDIENTS = {
  bun: 'Булка',
  cutlet: 'Котлета',
  sauce: 'Соус',
} as const;

const MOCK_ORDER_NUMBER = '12345';

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должен открывать и закрывать модальное окно с деталями ингредиента', () => {
    cy.get(SELECTORS.ingredientCard).first().click();
    cy.get(SELECTORS.modal, { timeout: 10000 }).should('be.visible');
    cy.get(SELECTORS.ingredientDetails, { timeout: 10000 }).should('be.visible');
    cy.get(SELECTORS.modalCloseButton).click({ force: true });
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('должен закрывать модальное окно по клику на оверлей', () => {
    cy.get(SELECTORS.ingredientCard).first().click();
    cy.get(SELECTORS.modal, { timeout: 10000 }).should('be.visible');
    cy.get(SELECTORS.modalOverlay).click({ force: true });
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('должен закрывать модальное окно по нажатию Esc', () => {
    cy.get(SELECTORS.ingredientCard).first().click();
    cy.get(SELECTORS.modal, { timeout: 10000 }).should('be.visible');
    cy.get('body').type('{esc}');
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('должен добавлять ингредиенты в конструктор по клику', () => {
    cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.bun).trigger('dragstart');
    cy.get(SELECTORS.constructorSection).trigger('drop');
    
    cy.get(SELECTORS.bunTop).should('contain', TEST_INGREDIENTS.bun);
    cy.get(SELECTORS.bunBottom).should('contain', TEST_INGREDIENTS.bun);
    
    cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.cutlet).trigger('dragstart');
    cy.get(SELECTORS.constructorSection).trigger('drop');
    
    cy.get(SELECTORS.ingredientsContainer)
      .find(SELECTORS.ingredientItem)
      .should('have.length', 1);
  });

  it('должен перетаскивать ингредиент в конструктор', () => {
    cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.bun).trigger('dragstart');
    cy.get(SELECTORS.constructorSection).trigger('drop');
    cy.get(SELECTORS.bunTop).should('contain', TEST_INGREDIENTS.bun);
    
    cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.cutlet).trigger('dragstart');
    cy.get(SELECTORS.constructorSection).trigger('drop');
    cy.get(SELECTORS.ingredientsContainer)
      .find(SELECTORS.ingredientItem)
      .should('have.length', 1);
  });

  it('должен удалять ингредиент из конструктора', () => {
    cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.bun).trigger('dragstart');
    cy.get(SELECTORS.constructorSection).trigger('drop');
    
    cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.cutlet).trigger('dragstart');
    cy.get(SELECTORS.constructorSection).trigger('drop');
    
    cy.get(SELECTORS.ingredientsContainer)
      .find(SELECTORS.ingredientItem)
      .first()
      .find('button')
      .click({ force: true });
    
    cy.get(SELECTORS.ingredientsContainer)
      .find(SELECTORS.ingredientItem)
      .should('have.length', 0);
    cy.get(SELECTORS.bunTop).should('be.visible');
  });

  it('должен показывать общую стоимость', () => {
    cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.bun).trigger('dragstart');
    cy.get(SELECTORS.constructorSection).trigger('drop');
    
    cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.cutlet).trigger('dragstart');
    cy.get(SELECTORS.constructorSection).trigger('drop');
    
    cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.sauce).trigger('dragstart');
    cy.get(SELECTORS.constructorSection).trigger('drop');
    
    cy.get(SELECTORS.totalPrice)
      .invoke('text')
      .then(parseInt)
      .should('be.gte', 300);
  });

  describe('Создание заказа', () => {
    it('должен перенаправлять на логин для неавторизованного пользователя', () => {
      cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.bun).trigger('dragstart');
      cy.get(SELECTORS.constructorSection).trigger('drop');
      
      cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.cutlet).trigger('dragstart');
      cy.get(SELECTORS.constructorSection).trigger('drop');
      
      cy.get(SELECTORS.orderButton).click({ force: true });
      cy.url().should('include', '/login');
    });

    it('должен создавать заказ для авторизованного пользователя', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          accessToken: 'Bearer test-token',
          refreshToken: 'test-refresh-token',
          user: {
            email: TEST_USER.email,
            name: TEST_USER.name,
          },
        },
      }).as('login');

      cy.intercept('GET', '**/auth/user', {
        statusCode: 200,
        body: {
          success: true,
          user: {
            email: TEST_USER.email,
            name: TEST_USER.name,
          },
        },
      }).as('getUser');

      cy.visit('/');
      cy.contains('Войти').click();
      cy.url().should('include', 'login');
      
      cy.get(SELECTORS.emailInput).should('be.visible').type(TEST_USER.email);
      cy.get(SELECTORS.passwordInput).should('be.visible').type(TEST_USER.password);
      cy.get(SELECTORS.loginSubmitButton).should('be.visible').click();

      cy.wait('@login', { timeout: 10000 }).then((interception) => {
        const { accessToken, refreshToken } = interception.response?.body || {};
        if (accessToken) window.localStorage.setItem('accessToken', accessToken);
        if (refreshToken) window.localStorage.setItem('refreshToken', refreshToken);
      });

      cy.wait(500);

      cy.visit('/');
      cy.wait('@getIngredients', { timeout: 10000 });
      cy.wait('@getUser', { timeout: 10000 });

      cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.bun).trigger('dragstart');
      cy.get(SELECTORS.constructorSection).trigger('drop');

      cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.cutlet).trigger('dragstart');
      cy.get(SELECTORS.constructorSection).trigger('drop');

      cy.get(SELECTORS.ingredientCard).contains(TEST_INGREDIENTS.sauce).trigger('dragstart');
      cy.get(SELECTORS.constructorSection).trigger('drop');

      cy.wait(500);

      cy.get(SELECTORS.orderButton).should('not.be.disabled');
      cy.get(SELECTORS.orderButton).click({ force: true });

      cy.wait('@createOrder', { timeout: 10000 }).its('response.statusCode').should('eq', 200);

      cy.get(SELECTORS.modal, { timeout: 10000 }).should('be.visible');
      cy.get(SELECTORS.orderNumber, { timeout: 10000 }).should('contain', MOCK_ORDER_NUMBER);

      cy.get(SELECTORS.modalCloseButton).click({ force: true });
      cy.get(SELECTORS.modal).should('not.exist');

      cy.get(SELECTORS.bunTop).should('not.exist');
    });
  });
});