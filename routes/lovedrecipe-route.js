// still need to do this just added the stuff from image uploading so far
const express= require('express');
const RecipeModel= require('../models/lovedrecipe-model.js');
const router= express.Router();
// to be able to upload images to this route
const multer= require('multer');
// to save user uploaded files in a specific folder
const myUploader = multer({
  //dest is the destination that specifies where to put the uploaded files
  dest: __dirname + '/../public/uploads/'
});
router.get('/recipes', (req, res, next) => {
  RecipeModel.find((err, recipeResults) => {
    if (err) {
      // use next() to skip to the ERROR PAGE
      next(err);
      return;
    }

    res.locals.recipesAndStuff = recipeResults;

    // display "products-list-view.ejs"
    res.render('recipe-views/mylovedrecipes-view.ejs');
  });
});

// STEP #1 of form submission for a new product
router.get('/recipes/new', (req,res,next) => {
  //any page that should only be accessed by owner
  if (req.user){
  res.render('recipe-views/addlovedrecipe-view.ejs');
}
else {
  res.redirect('/login');
}
});
// route below includes NEW stuff so i can upload files, should add a new folder to my public called uploads.
//if open the npm public/uploads/ can see the image in there.
// STEP #2 of form submission for a new product
// <form method="post" action="/products">
router.post(
  '/recipes',
  // must put input name here in parens so on form use recipePhoto or else change the name below.
  myUploader.single('photoUrl'),//this is just to show where the above stuff is located within the code.
  (req,res,next) => {
    console.log('***********************************************************');
    console.log('req.file(file upload from multer)');
    const theRecipe = new RecipeModel({
      recipename: req.body.recipename,
      recipesource: req.body.recipesource,
      sourcelink: req.body.sourcelink,
      photoUrl: '/uploads/'+ req.file.filename,
      recipecategory: req.body.recipecategory,
      recipecomment: req.body.recipecomment,
      // updated this to tags to match the form
      recipetags: req.body.tags,
      //owner of the recipes
      owner: req.user._id
    });

    theRecipe.save((err) => {
        if (err) {
          // If there was an error, use next() to skip to the ERROR PAGE.
          next(err);
          return;
        }

        // If saved successfully, redirect to a URL.
        // (redirect is STEP #3 of form submission for a new product)
        // res.redirect('/recipes/'+ theRecipe._id);
        res.redirect('/recipes/');
          // you can ONLY redirect to a URL 🌏

          // 🚨🚨🚨
          // If you don't redirect, you can refresh and duplicate your data!
          // 🚨🚨🚨
    });
  });
  // don't need this unless I get to product details page
  router.get('/recipes/:myId', (req,res,next) => {
    RecipeModel.findById(
      // find the rooms owned by the logged in user.   we want the current owner of the room
      // {owner: req.user._id},
      req.params.myId,
      (err,recipeFromDb) => {
        if (err) {
          next(err);
          return;
        }
        res.locals.recipesAndStuff= recipeFromDb;

  res.render('recipe-views/mylovedrecipes-view.ejs');
  }
  );
  });
  // STEP #1 of form submission for UPDATING a product
  router.get('/recipes/:myId/edit', (req, res, next) => {
  //    /products/595174b1e7890a86da4f5f0b/edit
  //                       |
  //                 req.params.myId

      RecipeModel.findById(
        req.params.myId,           // 1st argument -> the id to find in the DB
        (err, recipeFromDb) => {  // 2nd argument -> callback
            if (err) {
              // use next() to skip to the ERROR PAGE
              next(err);
              return;
            }

            res.locals.recipeDetails = recipeFromDb;

            res.render('recipe-views/editlovedrecipe-view.ejs');

            // Other way of transfering variables to the view:
            //
            // res.render('product-views/edit-product-view.ejs', {
            //   productDetails: productFromDb
            // });
        }
      );
  });

  // STEP #2 of form submission for UPDATING a product
  // <form method="post" action="/products/283u8eu239eu23e/update">
  //                |                             |
  //      -----------      ------------------------
  //      |                |
  router.post('/recipes/:myId/update', (req, res, next) => {
  //    /products/283u8eu239eu23e/update
  //                     |
  //              req.params.myId

      RecipeModel.findByIdAndUpdate(
        req.params.myId,            // 1st argument -> id of document to update

        {                           // 2nd argument -> object of fields to update
          recipename: req.body.recipename,
          recipesource: req.body.recipesource,
          sourcelink: req.body.sourcelink,
          photoUrl: '/uploads/'+ req.file.filename,
          recipecategory: req.body.recipecategory,
          recipecomment: req.body.recipecomment,
          // updated this to tags to match the form
          recipetags: req.body.tags,
          //owner of the recipes
          owner: req.user._id
        },

        (err, recipeFromDb) => {  // 3rd argument -> callback!
          if (err) {
            // use next() to skip to the ERROR PAGE
            next(err);
            return;
          }

          // If saved successfully, redirect to a URL.
          // (redirect is STEP #3 of form submission for a new product)
          res.redirect('/recipes/' + recipeFromDb._id);
            // you can ONLY redirect to a URL 🌏

            // 🚨🚨🚨
            // If you don't redirect, you can refresh and duplicate your data!
            // 🚨🚨🚨
        }
      );
  });
  module.exports= router;
