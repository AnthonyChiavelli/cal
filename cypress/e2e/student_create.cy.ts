describe("Create Event Modal", () => {
  it("Should validate and require proper fields", () => {
     // Setup
     cy.visit("http://localhost:3000/");
     cy.get('a').contains("Log in").click()
     cy.loginToAuth0(
       Cypress.env('auth0_username'),
       Cypress.env('auth0_password'),
       )
     cy.url().should('include', '/app')
     cy.visit("http://localhost:3000/app")
 
     cy.getCy('sidebar-link-Students').click()
     cy.getCy('button-add-student').click()
     
     // Fill form
     cy.getCy('input-firstName').clear().type('Brontus') 
     cy.getCy('submit-form').click()
     cy.url().should('include', '/app/students/add')
     
     cy.getCy('input-lastName').clear().type('Palontus') 
     cy.getCy('submit-form').click()
     cy.url().should('include', '/app/students/add')
     
     cy.getCy('input-gradeLevel').clear().type('11') 
     cy.getCy('submit-form').click()
     cy.url().should('include', '/app/students/add')

  })

  // TODO implement
  // it("Should be able to create a student and link to existing family", () => {
  //    // Setup
  //    cy.visit("http://localhost:3000/");
  //    cy.get('a').contains("Log in").click()
  //    cy.loginToAuth0(
  //      Cypress.env('auth0_username'),
  //      Cypress.env('auth0_password'),
  //      )
  //    cy.url().should('include', '/app')
  //    cy.visit("http://localhost:3000/app")
 
  //    cy.getCy('sidebar-link-Students').click()
  //    cy.getCy('button-add-student').click()

  //    // Fill form
  //    cy.getCy('input-firstName').clear().type('Brontus') 
  //    cy.getCy('input-lastName').clear().type('Palontus') 
  //    cy.getCy('input-gradeLevel').clear().type('11') 
  //    cy.get('.creatable-family').click()
  //    cy.wait(500)
  // })

});
