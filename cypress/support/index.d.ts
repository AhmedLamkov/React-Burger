/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(email: string, password: string): Chainable<void>;
    addIngredientToConstructor(ingredientName: string): Chainable<void>;
    checkModal(): Chainable<void>;
    createOrder(): Chainable<void>;
    checkOrderNumber(expectedNumber: string | number): Chainable<void>;
  }
}