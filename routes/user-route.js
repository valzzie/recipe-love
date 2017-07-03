//these 2 are required in every route
const express= require('express');
const bcrypt = require('bcrypt');
const router= express.Router();
const passport= require('passport');

//add this when did post for /signup
const UserModel = require('../models/user-model.js');

//to display the signup-view form
router.get('/signup',(req,res,next) => {
  res.render('auth-views/signup-view.ejs');
});

router.post('/signup',(req,res,next) => {
  //ehck if either is empty
if (req.body.signupUsername === ''|| req.body.signupPassword === ''){
  //adding a variable that will go to the view if they don't put both a username and pswd and display that message.
  res.locals.messageForDumbUsers = "Please provide both username and password";
  res.render('auth-views/signup-view.ejs');
  return;
}
//query the db to see if the username is already taken

UserModel.findOne(
  //see if the user entered signupUsername is already in our db.
  //will get one of 2 things returned, an err or a userFromDb
  {username: req.body.signupUsername},
  //userFromDb is the same info we retrieved from req.body.signupUsername.
  //if username is taken the userFromDb variable will have a result
  (err, userFromDb) => {
    if(err){
      next(err);
      return;
    }
    //check if userFrom DB is populated and not empty, if its empty it means that username is not already taken and ok.
    if (userFromDb){
      //if that s the cse display an error
    res.locals.messageForUsers= "Sorry but that username is taken.";
    res.render('auth-views/signup-view.ejs');
    return;
  }

//if we get here, we are ready to save the new user in the DB since its not alreasdy taken.
  const salt= bcrypt.genSaltSync(10);
  const scrambledPassword = bcrypt.hashSync(req.body.signupPassword,salt);

  const theUser = new UserModel({
  fullName: req.body.signupFullName,
  username: req.body.signupUsername,
  encryptedPassword: scrambledPassword

});
theUser.save((err) => {
  if(err){
    next(err);
    return;
  }
  //redirect to home if registration is successfull.
  res.redirect('/');
});
});
});
//End registration
//Log IN
router.get('/login', (req,res,next) => {
  res.render('auth-views/login-view.ejs');
});

router.post('/login', passport.authenticate(
  'local', //ist arg: name of the Strategy determined by the strategy's npm package.
  {   //2nd arg: settings object
    successRedirect: '/', //where to go if login works
    failureRedirect: '/login' //where to go if login fails
  }
));
//End log in

router.get('/logout',(req,res,next) => {
  //the req.logout function below is defined b the passport middleware
  req.logout();
  res.redirect('/');
});

//SOCIAL LOGINS
//facebook login
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
passport.authenticate(
  'facebook',
  {
    successRedirect:'/decision',
    failureRedirect: '/login'
  }
)
);
//google login
router.get('/auth/google', passport.authenticate('google',
{
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}
));
router.get('/auth/google/callback',
passport.authenticate(
  'google',
  {
    successRedirect:'/special',
    failureRedirect: '/login'
  }
)
);
//required on every route
module.exports= router;
