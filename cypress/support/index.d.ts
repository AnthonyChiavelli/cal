declare namespace Cypress {
  interface Chainable {
    loginToAuth0(userName: string, password: string): Chainable<Element>;
    seedDatabase(): Chainable<Element>;
  }
}