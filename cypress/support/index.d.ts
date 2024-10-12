declare namespace Cypress {
  interface Chainable {
    loginToAuth0(userName: string, password: string): Chainable<Element>;
    seedDatabase(): Chainable<Element>;
    clearSeedDatafromDatabase(): Chainable<Element>;
    getCy(dataCySelector: string, additionalSelectors?: string): Chainable<JQuery<HTMLElement>>;
  }
}