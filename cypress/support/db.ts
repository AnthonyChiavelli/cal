const createdIds: string[] = [];

function seedDatabase(){
  cy.request('POST', 'http://localhost:3000/api/seed');
}