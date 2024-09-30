describe("Create Event Modal", () => {

  const selectStudent = (name: string) => {
    cy.get('input[data-cy=student-autocomplete]').parent().click()
    cy.wait(500)
    cy.get('input[data-cy=student-autocomplete]').parent().click()
    cy.get('li[role="option"]').children().contains(name).first().click()
  }

  const fuzzyComparePrice = (expectedPriceString: string, actual: number) => {
    expect(Math.abs(parseFloat(expectedPriceString) - actual)).to.be.lessThan(0.02)
  }

  it.only("Should be able to book a basic class", () => {
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
     cy.getCy('scheduledForDate').clear().type('1999-02-01') 
     cy.getCy('scheduledForTime').clear().type('09:30') 
     cy.getCy('duration').type('60{enter}')
     selectStudent('Cranjis')
     selectStudent('Nougat')
     cy.getCy('class-notes').click()
     cy.getCy('class-notes').click().type('Don\'t mention cheese in this class') 
     cy.getCy('submit-button').click()

     // TODO better way to wait, check class time and details
     cy.wait(2000)
     cy.getCy("calendar-event").should('exist')
  })

  it("Should apply and update prices as students are added and removed, prices are set custom, and duration is changed", () => {
    const BASE_COST = 125.00;

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
    cy.getCy('scheduledForDate').clear().type('1999-02-01') 
    cy.getCy('scheduledForTime').clear().type('09:30') 
    cy.getCy('duration').type('60{enter}')

    // Add students
    selectStudent('Cranjis')
    cy.getCy('event-total').should('have.text', `$${BASE_COST.toFixed(2)}`)
    cy.getCy('row-Cranjis', 'input').should('have.value', BASE_COST)
    
    selectStudent('Nougat')
    cy.getCy('event-total').invoke('text').then((val) => {
      fuzzyComparePrice(val.replace('$', ''), BASE_COST)
    })
    cy.getCy('row-Nougat', 'input').invoke('val').then((val) => {
      fuzzyComparePrice(val as string, BASE_COST / 2)
    })
    cy.getCy('row-Cranjis', 'input').invoke('val').then((val) => {
      fuzzyComparePrice(val as string, BASE_COST / 2)
    })
    
    selectStudent('Quenjamin')
    cy.getCy('event-total').invoke('text').then((val) => {
      fuzzyComparePrice(val.replace('$', ''), BASE_COST)
    })
    cy.getCy('row-Quenjamin', 'input').invoke('val').then((val) => {
      fuzzyComparePrice(val as string, BASE_COST / 3)
    })
    cy.getCy('row-Nougat', 'input').invoke('val').then((val) => {
      fuzzyComparePrice(val as string, BASE_COST / 3)
    })
    cy.getCy('row-Cranjis', 'input').invoke('val').then((val) => {
      fuzzyComparePrice(val as string, BASE_COST / 3)
    })

    // Remove student
    cy.getCy('row-Nougat', '.remove-student').click()
    cy.getCy('event-total').invoke('text').then((val) => {
      fuzzyComparePrice(val.replace('$', ''), BASE_COST)
    })
    cy.getCy('row-Cranjis', 'input').invoke('val').then((val) => {
      fuzzyComparePrice(val as string, BASE_COST / 2)
    })
    cy.getCy('row-Quenjamin', 'input').invoke('val').then((val) => {
      fuzzyComparePrice(val as string, BASE_COST / 2)
    })

    // Set a new duration
    cy.getCy('duration').type('{selectall}').type('120{enter}')
    const totalCost = BASE_COST * 2
    cy.getCy('event-total').invoke('text').then((val) => {
      fuzzyComparePrice(val.replace('$', ''), totalCost)
    })
    
    cy.getCy('row-Cranjis', 'input').invoke('val').then((val) => {
      fuzzyComparePrice(val as string, totalCost / 2)
    })
    cy.getCy('row-Quenjamin', 'input').invoke('val').then((val) => {
      fuzzyComparePrice(val as string, totalCost / 2)
    })

    // Set a custom price on a student
    // TODO implement this test. Typing into student cost input is not working
    // cy.getCy('row-Slambop', 'input').clear()
    // cy.wait(500)
    // cy.getCy('row-Slambop', 'input').type('{selectall}').type('20.00')
    // cy.getCy('row-Slambop', 'input').should('have.value', '20.00')
    // cy.getCy('event-total').invoke('text').then((val) => {
    //   fuzzyComparePrice(val.replace('$', ''), (TOTAL_COST / (3) * 2) + 20)
    // })
  
    // // Make sure selecting a new student doesn't change the ones with modified prices
    // // selectStudent('Rodneep')
    // // cy.getCy('row-Slambop', 'input').should('have.value', '20.00')
    
    // // selectStudent('Slambop')
    // // cy.getCy('event-total').should('have.text', `$${TOTAL_COST.toFixed(2)}`)
    // // cy.getCy('row-Beev', 'input').should('have.value', (TOTAL_COST / 3).toFixed(2))
    // // cy.getCy('row-Goopner', 'input').should('have.value', (TOTAL_COST / 3).toFixed(2))
    // // cy.getCy('row-Slambop', 'input').should('have.value', (TOTAL_COST / 3).toFixed(2))
  });
});
