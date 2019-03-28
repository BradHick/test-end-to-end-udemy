const faker = require('faker');
const { generateRecipe, generateUser } = require('../../utils/generate');


describe('The recipe creation process', () => {

  let fakeUser;

  beforeEach(() => {

    fakeUser = generateUser();

    cy.request('POST', 'http://localhost:5678/api/v1/users/signup', fakeUser)
      .then((response) => {
        cy.window().then((window) => {
          window.localStorage.setItem('authUser', JSON.stringify(response.body));
        });
      });

  });

  it('Should create a recipe for the user', () => {

    // ARRANGE
    const fakeRecipe = generateRecipe();

    // provide athenticated user
    cy.visit('http://localhost:5678');

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
