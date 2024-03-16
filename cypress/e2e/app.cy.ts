describe("Navigation", () => {
  it("should navigate to the about page", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");
    
    cy.get('a').contains("Log in").click()
    cy.loginToAuth0(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password'),
      )
    cy.visit("http://localhost:3000/app/schedule/add");
    // cy.get('a').contains("Schedule").click()
    // cy.get('a[href="/app/schedule"]').click()

    // // Find a link with an href attribute containing "about" and click it

    // // The new url should include "/about"
    cy.url().should('include', '/app')

    // // The new page should contain an h1 with "About"
    // cy.get('h1').contains('About')
  });
});
