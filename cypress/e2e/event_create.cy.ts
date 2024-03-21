describe("Create Event Modal", () => {
  it("Should apply the correct default price for students as they are added to event", () => {
    // Setup
    cy.visit("http://localhost:3000/");
    cy.get('a').contains("Log in").click()
    cy.loginToAuth0(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password'),
      )
    cy.url().should('include', '/app')

    cy.visit("http://localhost:3000/app/schedule/add")

    // Fill form
    cy.get('input[data-cy=duration]').type('60{enter}')
    cy.get('input[data-cy=student-autocomplete]').parent().click()
    cy.wait(500)
    cy.get('input[data-cy=student-autocomplete]').parent().click()
    cy.get('li[role="option"]').children().contains('Beev').first().click()

    // Check prices
    cy.get('[data-cy=event-total]').should('have.text', '$125.00')

  });
});
