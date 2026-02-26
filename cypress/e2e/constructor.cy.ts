describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должен открывать и закрывать модальное окно с деталями ингредиента', () => {
    cy.get('[class*="ingredient_card"]').first().click();
    cy.get('[data-testid=modal]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid=ingredient-details]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid=modal-close-button]').click({ force: true });
    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('должен закрывать модальное окно по клику на оверлей', () => {
    cy.get('[class*="ingredient_card"]').first().click();
    cy.get('[data-testid=modal]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid=modal-overlay]').click({ force: true });
    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('должен закрывать модальное окно по нажатию Esc', () => {
    cy.get('[class*="ingredient_card"]').first().click();
    cy.get('[data-testid=modal]', { timeout: 10000 }).should('be.visible');
    cy.get('body').type('{esc}');
    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('должен добавлять ингредиенты в конструктор по клику', () => {
    cy.get('[class*="ingredient_card"]').contains('Булка').trigger('dragstart');
    cy.get('[data-testid=burger-constructor-section]').trigger('drop');
    
    cy.get('[data-testid=constructor-bun-top-container]').should('contain', 'Булка');
    cy.get('[data-testid=constructor-bun-bottom-container]').should('contain', 'Булка');
    
    cy.get('[class*="ingredient_card"]').contains('Котлета').trigger('dragstart');
    cy.get('[data-testid=burger-constructor-section]').trigger('drop');
    
    cy.get('[data-testid=constructor-ingredients-container]')
      .find('[class*="item"]')
      .should('have.length', 1);
  });

  it('должен перетаскивать ингредиент в конструктор', () => {
    cy.get('[class*="ingredient_card"]').contains('Булка').trigger('dragstart');
    cy.get('[data-testid=burger-constructor-section]').trigger('drop');
    cy.get('[data-testid=constructor-bun-top-container]').should('contain', 'Булка');
    
    cy.get('[class*="ingredient_card"]').contains('Котлета').trigger('dragstart');
    cy.get('[data-testid=burger-constructor-section]').trigger('drop');
    cy.get('[data-testid=constructor-ingredients-container]')
      .find('[class*="item"]')
      .should('have.length', 1);
  });

  it('должен удалять ингредиент из конструктора', () => {
    cy.get('[class*="ingredient_card"]').contains('Булка').trigger('dragstart');
    cy.get('[data-testid=burger-constructor-section]').trigger('drop');
    
    cy.get('[class*="ingredient_card"]').contains('Котлета').trigger('dragstart');
    cy.get('[data-testid=burger-constructor-section]').trigger('drop');
    
    cy.get('[data-testid=constructor-ingredients-container]')
      .find('[class*="item"]')
      .first()
      .find('button')
      .click({ force: true });
    
    cy.get('[data-testid=constructor-ingredients-container]')
      .find('[class*="item"]')
      .should('have.length', 0);
    cy.get('[data-testid=constructor-bun-top-container]').should('be.visible');
  });

  it('должен показывать общую стоимость', () => {
    cy.get('[class*="ingredient_card"]').contains('Булка').trigger('dragstart');
    cy.get('[data-testid=burger-constructor-section]').trigger('drop');
    
    cy.get('[class*="ingredient_card"]').contains('Котлета').trigger('dragstart');
    cy.get('[data-testid=burger-constructor-section]').trigger('drop');
    
    cy.get('[class*="ingredient_card"]').contains('Соус').trigger('dragstart');
    cy.get('[data-testid=burger-constructor-section]').trigger('drop');
    
    cy.get('[data-testid=constructor-total-price]')
      .invoke('text')
      .then(parseInt)
      .should('be.gte', 300);
  });

  describe('Создание заказа', () => {
    it('должен перенаправлять на логин для неавторизованного пользователя', () => {
      cy.get('[class*="ingredient_card"]').contains('Булка').trigger('dragstart');
      cy.get('[data-testid=burger-constructor-section]').trigger('drop');
      
      cy.get('[class*="ingredient_card"]').contains('Котлета').trigger('dragstart');
      cy.get('[data-testid=burger-constructor-section]').trigger('drop');
      
      cy.get('[data-testid=constructor-order-button]').click({ force: true });
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
            email: 'test@test.com',
            name: 'Test User'
          }
        }
      }).as('login');

      cy.intercept('GET', '**/auth/user', {
        statusCode: 200,
        body: {
          success: true,
          user: {
            email: 'test@test.com',
            name: 'Test User'
          }
        }
      }).as('getUser');

      cy.visit('/login');
      cy.get('[data-testid=email-input]').type('test@test.com');
      cy.get('[data-testid=password-input]').type('password123');
      cy.get('[data-testid=login-submit-button]').click();
      
      cy.wait('@login').then((interception) => {
        window.localStorage.setItem('accessToken', interception.response?.body.accessToken);
        window.localStorage.setItem('refreshToken', interception.response?.body.refreshToken);
      });
      
      cy.wait(500);

      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser');

      cy.get('[class*="ingredient_card"]').contains('Булка').trigger('dragstart');
      cy.get('[data-testid=burger-constructor-section]').trigger('drop');
      
      cy.get('[class*="ingredient_card"]').contains('Котлета').trigger('dragstart');
      cy.get('[data-testid=burger-constructor-section]').trigger('drop');
      
      cy.get('[class*="ingredient_card"]').contains('Соус').trigger('dragstart');
      cy.get('[data-testid=burger-constructor-section]').trigger('drop');
      
      cy.wait(500);

      cy.get('[data-testid=constructor-order-button]').should('not.be.disabled');
      cy.get('[data-testid=constructor-order-button]').click({ force: true });
      
      cy.wait('@createOrder').its('response.statusCode').should('eq', 200);

      cy.get('[data-testid=modal]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid=order-number]').should('contain', '12345');

      cy.get('[data-testid=modal-close-button]').click({ force: true });
      cy.get('[data-testid=modal]').should('not.exist');

      cy.get('[data-testid=constructor-bun-top-container]').should('not.exist');
    });
  });
});