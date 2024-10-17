describe("Student Create Page", () => {
  it.skip("Should propery accept input and create a family", () => {
    cy.visit("http://localhost:3000/");
    cy.get("a").contains("Log in").click();
    cy.loginToAuth0(Cypress.env("auth0_username"), Cypress.env("auth0_password"));
    cy.url().should("include", "/app");
    cy.visit("http://localhost:3000/app");

    cy.getCy("sidebar-link-Students").click();
    cy.getCy("button-add-student").click();

    cy.getCy("input-firstName").clear().type("Junty");
    cy.getCy("input-firstName").should("have.value", "Junty");

    cy.getCy("input-lastName").clear().type("Muntus");
    cy.getCy("input-lastName").should("have.value", "Muntus");

    cy.getCy("input-gradeLevel").clear().type("12");
    cy.getCy("input-gradeLevel").should("have.value", "12");

    // TODO find a way to select a family from the list

    cy.getCy("textarea-notes").clear().type("A fine student");
    cy.getCy("textarea-notes").should("have.value", "A fine student");

    cy.getCy("submit-form").click();
    cy.url().should("equal", "http://localhost:3000/app/students");
    cy.get("table tr td a").should("contain", "Munty");
  })

});
