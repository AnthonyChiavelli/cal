function loginViaAuth0Ui(username: string, password: string) {
  // App landing page redirects to Auth0.
  // cy.visit('/')

  // Login on Auth0.
  cy.origin(Cypress.env("auth0_domain"), { args: { username, password } }, ({ username, password }) => {
    cy.get("input#username").type(username);
    cy.get("input#password").type(password, { log: false });
    cy.contains("button[value=default]", "Continue").click();
  });

  // Ensure Auth0 has redirected us back to the RWA.
  cy.url().should("equal", "http://localhost:3000/app");
}

Cypress.Commands.add("loginToAuth0", (username: string, password: string) => {
  const log = Cypress.log({
    displayName: "AUTH0 LOGIN",
    message: [`🔐 Authenticating | ${username}`],
    // @ts-ignore
    autoEnd: false,
  });
  log.snapshot("before");

  loginViaAuth0Ui(username, password);

  log.snapshot("after");
  log.end();
});

Cypress.Commands.add("seedDatabase", () => {
  cy.request({
    method: "POST",
    url: "http://localhost:3000/api/test-seed",
    body: {
      // TODO make secure
      authorization: 41,
    },
    headers: {
      authorization: Cypress.env("cypress_api_token"),
    },
  });
});

Cypress.Commands.add("clearSeedDatafromDatabase", () => {
  cy.request({
    method: "POST",
    url: "http://localhost:3000/api/test-seed-clear",
    body: {
      // TODO make secure
      authorization: 41,
    },
    headers: {
      authorization: Cypress.env("cypress_api_token"),
    },
  });
});

Cypress.Commands.add("getCy", (dataCySelector: string, additionalSelectors?: string) => {
  if (additionalSelectors) {
    return cy.get(`[data-cy=${dataCySelector}] ${additionalSelectors}`);
  } else {
    return cy.get(`[data-cy=${dataCySelector}]`);
  }
});

/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
