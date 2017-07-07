const mongoose = require('mongoose');
                                    // database name
                                    //    |
mongoose.connect('mongodb://localhost/recipelove');
                               //         |
                               // use ironshop

// We have to connect the DB again here
// because seed.js is SEPARATE from app.js.


const Recipe = require('../models/lovedrecipe-model.js');
const recipesArray = [
  {
      recipename: 'Creamy Skillet Chicken Cacciatore',
      recipesource: 'The Recipe Critic',
      sourcelink: "https://therecipecritic.com/2017/04/creamy-skillet-chicken-cacciatore/",
      photoUrl: '/images/pexels-photo-145804.jpeg',
      recipecategory: 'Dinner',
      recipecomment: 'Add a little bit of white wine to it as well.',
      recipetags: ['Poultry','Company']
  },
  {
    recipename: 'French Toast 1',
    recipesource: 'Allrecipes',
    sourcelink: "http://allrecipes.com/recipe/7016/french-toast-i/",
    photoUrl: '/images/alexandra-kusper-217070.jpg',
    recipecategory: 'Breakfast',
    recipecomment: 'Add vanilla and shredded coconut to it.',
    recipetags: ['Company']
  },
  {
  recipename: 'Seafood Spaghetti',
  recipesource: 'Pintrest',
  sourcelink: "https://www.pinterest.com/pin/111745634483528457/",
  photoUrl: '/images/carissa-gan-76325.jpg',
  recipecategory: 'Dinner',
  recipecomment: 'Use shrimp and scallops in it.',
  recipetags: ['Seafood']
}
];
Recipe.create(
  recipesArray,            // 1st argument -> array of product info objects

  (err, recipeResults) => {   // 2nd argument -> callback!
    if (err) {
      console.log('OMG! Database error.');
      return;
    }

    recipeResults.forEach((oneRecipe) => {
      console.log('New Recipe! ' + oneRecipe.recipename);
    });
  }
);
