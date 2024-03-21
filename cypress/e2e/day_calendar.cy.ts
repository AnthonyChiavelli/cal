describe("Day Calendar", () => {
  it("should allow clicking of the calendar to launch the event create modal at the right time", () => {
    // Setup
    cy.visit("http://localhost:3000/");
    cy.get('a').contains("Log in").click()
    cy.loginToAuth0(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password'),
      )
    cy.url().should('include', '/app')

    cy.visit("http://localhost:3000/app/schedule?p=day&t=2024-03-14")

    for (let i = 0; i < 24; i++) {
      cy.get(`[data-cy=calendar-row-${i}]`).click()
      cy.get('input[data-cy=scheduledForDate]').should('have.value', '2024-03-14')
      cy.get('input[data-cy=scheduledForTime]').should('have.value', `${i.toString().padStart(2, '0')}:00`)
      cy.get('[data-cy=cancel-create-event]').click()
    }
  });
});
