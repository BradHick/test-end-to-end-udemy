
const { generateRecipe, generateUser } = require('../../utils/generate');

describe('The recipe actions', () => {

  let recipeCreated;

  beforeEach(() => {
    // ARRANGE

    // setup first user, create a recipe
    const user1 = generateUser();
    const recipe1 = generateRecipe();

    cy.request('POST', 'http://localhost:5678/api/v1/users/signup', user1)
      .then((response) => {
        cy.request('POST', 'http://localhost:5678/api/v1/recipes', {
          title: recipe1.title,
          description: recipe1.description,
          timeToCook: recipe1.timeToCook,
          ingredients: JSON.stringify(recipe1.ingredients),
          procedure: JSON.stringify(recipe1.procedure),
          imageUrl: 'http://res.cloudinary.com/bahdcoder/image/upload/v1519099617/ddddd_cmqwxl.png',
          access_token: response.body.data.access_token
        }).then((recipeResponse) => {
          recipeCreated = recipeResponse.body.data.recipe;
        });
      });

    // setup seconde user
    const user2 = generateUser();

    cy.request('POST', 'http://localhost:5678/api/v1/users/signup', user2)
      .then((response) => {
        cy.window().then((window) => {
          window.localStorage.setItem('authUser', JSON.stringify(response.body));
        });
      });
  });

  it('Should favorite a recipe', () => {

    // ACTION
    // perform favorite action
    cy.visit(`http://localhost:5678/recipe/${recipeCreated.id}`);

    cy.get(':nth-child(3) > .ion').click();

    cy.get('.noty_body').should('contain', 'Recipe favorited successfully');


    // ASSERTIONS
    // user sees a notification
    // favorite count is incrased

  });

  it('Should upvote a recipe', () => {

    cy.visit(`http://localhost:5678/recipe/${recipeCreated.id}`);

    cy.get('.text-muted.h4 > :nth-child(1) > .ion').click();

    cy.get('.noty_body').should('contain', 'Recipe upvoted successfully');

  });

  it('Should downvote a recipe', () => {

    cy.visit(`http://localhost:5678/recipe/${recipeCreated.id}`);

    cy.get(':nth-child(2) > .ion').click();

    cy.get('.noty_body').should('contain', 'Recipe downvoted successfully');

  });
});
