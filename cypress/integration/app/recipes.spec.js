const faker = require('faker');

const generateFakeRecipe = () => ({
  title: faker.lorem.sentence(),
  description: faker.lorem.sentence(4),
  timeToCook: faker.random.number(),
  ingredients: [faker.lorem.sentence(), faker.lorem.sentence()],
  procedure: [faker.lorem.sentence(), faker.lorem.sentence()]
});

describe('The recipe creation process', () => {

  it('Should create a recipe for the user', () => {

    // ARRANGE
    const fakeRecipe = generateFakeRecipe();

    // provide athenticated user
    cy.visit('http://localhost:5678');
    cy.get('[href="/auth/register"]').click();

    const fakeUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    cy.get('input[name="name"]').type(fakeUser.name);
    cy.get('input[name="email"]').type(fakeUser.email);
    cy.get('input[name="password"]').type(fakeUser.password);
    cy.get('input[name="confirmPassword"]').type(fakeUser.password);

    cy.get('.btn').click();

    // ACTION

    cy.contains('Create recipe').click();

    // put in data into form

    cy.get('[data-testid=recipeTitle]').type(fakeRecipe.title);
    cy.get('[data-testid=recipeTimeToCook]').type(fakeRecipe.timeToCook);
    cy.get('[data-testid=recipeDescription]').type(fakeRecipe.description);
    cy.get('[data-testid=recipeIngredient-0]').type(fakeRecipe.ingredients[0]);
    cy.get('.card-body > :nth-child(8)').click();
    cy.get('[data-testid=recipeIngredient-1]').type(fakeRecipe.ingredients[1]);

    cy.get('[data-testid=recipeProcedure-0]').type(fakeRecipe.procedure[0]);
    cy.get(':nth-child(12)').click();
    cy.get('[data-testid=recipeProcedure-1]').type(fakeRecipe.procedure[1]);

    cy.get('[data-testid=recipePublish]').click();

    // ASSERTION
    // assert we see reipe details
    cy.url().should('contain', 'recipe');

    cy.contains(fakeRecipe.title);
    cy.contains(fakeRecipe.timeToCook);
    cy.contains(fakeRecipe.description);
    cy.contains(fakeRecipe.ingredients[0]);
    cy.contains(fakeRecipe.ingredients[1]);
    cy.contains(fakeRecipe.procedure[0]);
    cy.contains(fakeRecipe.procedure[1]);

  });

});
