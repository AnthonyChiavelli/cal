
describe("Family create page", () => {
  it("Should properly accept input and create a family", () => {
    
    // Setup
    cy.visit("http://localhost:3000/");
    cy.get("a").contains("Log in").click();
    cy.loginToAuth0(Cypress.env("auth0_username"), Cypress.env("auth0_password"));
    cy.url().should("include", "/app");
    cy.visit("http://localhost:3000/app");

    cy.getCy("sidebar-link-Families").click();
    cy.getCy("button-add-family").click();

    // Fill form
    cy.getCy("input-familyName").clear().type("Pringer");
    cy.getCy("input-familyName").should("have.value", "Pringer");

    cy.getCy("input-parent1FirstName").clear().type("Gerth");
    cy.getCy("input-parent1FirstName").should("have.value", "Gerth");

    cy.getCy("input-parent1LastName").clear().type("Plungitude");
    cy.getCy("input-parent1LastName").should("have.value", "Plungitude");

    cy.getCy("phone-input-parent1Phone").clear().type("3334445555");
    cy.getCy("phone-input-parent1Phone").should("have.value", "(333) 444-5555");

    cy.getCy("input-parent2FirstName").clear().type("Legbop");
    cy.getCy("input-parent2FirstName").should("have.value", "Legbop");

    cy.getCy("input-parent2LastName").clear().type("Shlerm");
    cy.getCy("input-parent2LastName").should("have.value", "Shlerm");

    cy.getCy("phone-input-parent2Phone").clear().type("7778889999");
    cy.getCy("phone-input-parent2Phone").should("have.value", "(777) 888-9999");

    cy.getCy("textarea-notes").clear().type("Notes");
    cy.getCy("textarea-notes").should("have.value", "Notes");

    cy.getCy("submit-form").click();

    cy.url().should("equal", "http://localhost:3000/app/families");

    cy.get("table tr td a").should("contain", "Pringer");
  });
});
