Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept('POST', '**/auth/login', { fixture: 'login.json' }).as('login');
  
  cy.visit('/login');
  cy.get('[data-testid=email-input]').type(email);
  cy.get('[data-testid=password-input]').type(password);
  cy.get('[data-testid=login-submit-button]').click();
  
  cy.wait('@login');
});

Cypress.Commands.add('addIngredientToConstructor', (ingredientName: string) => {
  cy.contains(ingredientName)
    .parents('[class*="ingredient_card"]')
    .then(($card) => {
      if ($card.find('button[data-testid^="add-ingredient"]').length) {
        cy.wrap($card).find('button[data-testid^="add-ingredient"]').click({ force: true });
      } else {
        cy.wrap($card).trigger('dragstart', { dataTransfer: new DataTransfer() });
        cy.get('[data-testid=burger-constructor-section]').trigger('drop');
      }
    });
  cy.wait(200);
});

Cypress.Commands.add('checkModal', () => {
  cy.get('[data-testid=modal]').should('be.visible');
  cy.get('[data-testid=modal-overlay]').should('be.visible');
  cy.get('[data-testid=modal-close-button]').click();
  cy.get('[data-testid=modal]').should('not.exist');
});

Cypress.Commands.add('createOrder', () => {
  cy.get('[data-testid=constructor-order-button]').click();
});

Cypress.Commands.add('checkOrderNumber', (expectedNumber: string | number) => {
  cy.get('[data-testid=order-number]').should('contain', expectedNumber);
});