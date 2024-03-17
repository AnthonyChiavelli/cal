describe("Navigation", () => {
  it("should navigate to the about page", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");
    
    cy.get('a').contains("Log in").click()
    cy.loginToAuth0(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password'),
      )

    // // The new url should include "/about"
    cy.url().should('include', '/app')
  });
});
