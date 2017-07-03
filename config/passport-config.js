//we are configuring passport in this file to avoid making app.js to big of a file.
// console.log('***********************');//will see in terminal if i connected it correctly.  Do at beginning.
const passport= require('passport');
const bcrypt= require('bcrypt');
const UserModel= require('../models/user-model.js');
//serializeUser: controls what goes int the bowl aka: session.
//(save only hte user's db ID in the bowl)- this happens ONLY when you log in
passport.serializeUser((userFromDb,next)=> {
  //null refers to no error isnce we are handlling errors is another spot.
  next(null,userFromDb._id);
});


//deserializeUser: controls what you get when you look in the bowl, aka session.
//(use the ID in the bowl to retrieve the users info)- happens every time you visit the site after logging in.
passport.deserializeUser((idFromBowl,next)=> {
  UserModel.findById(
    idFromBowl,
    (err,userFromDb) => {
      if (err) {
        next(err);
        return;
      }
      next(null,userFromDb);
    });
});

//STRATEGIES below aka: different ways we can log into our app******************diff ways we can log into our app
//Strategy 1:  setup passport-local(logging in with a username and a password from a form, the OG way).
const LocalStrategy= require('passport-local').Strategy;

passport.use(new LocalStrategy(
  { //1st arg-> settings object
    usernameField: 'loginUsername',
    passwordField: 'loginPassword'
  },
  (formUsername,formPassword,next) => { //2nd arg: callback that is called when a user tries to login

    //Logic to consider: Is ther already an account with the provided username in the db?
    UserModel.findOne(
      {username:formUsername},
      (err,userFromDb) => {
        if(err) {
        next(err);
        return;
      }
      //if the username doesn't exist in the db then the userFromDB will be empty and login will fail.
      if(userFromDb === null){
        //in passport, if you call next with false in 2nd position that means login failed.
        next(null,false);
        return;
      }
      //If username does exist is the password correct?
      //checks the passord given to password saved if doesn't match it fails.
      if(bcrypt.compareSync(formPassword, userFromDb.encryptedPassword) === false){
        next(null,false);
        return;
      }
      //if the new password and stored password match then they can login.s
      next(null,userFromDb);
    }
    );
  }
));
//everything above will always need re: serialized and deserialized users
//passport-facebook aks loggind in with your facebook account
const FbStrategy = require('passport-facebook').Strategy;
passport.use(new FbStrategy(
  {  //1st arg is the settings object
    clientID: process.env.myFacebookClientID,
    clientSecret:process.env.myFacebookSecret,
    //this is the route user is redirected to from facebook after they log into facebook.
    callbackURL: '/auth/facebook/callback'
  },
  (accessToken,refreshToken,profile,next) => { //2nd arg is the callback, will be called when user alows us to log them in with facebook.
//console log the info we get from 3rd party services like facebook to see the structure and make srue I am using it correctly.
console.log("*************************************************");
console.log("profile");
UserModel.findOne(
  {facebookId: profile.id},
  (err,userFromDb)=> {
    if(err){
      next(err);
      return;
    }
    //if this is first time user logs in with facebook userFromDb will be empty
    //check if they have logged in before if so just log them in.
    if(userFromDb){
      next(null,userFromDb);
      return;
    }
    //if have not logged in before, save them in the db!
    const theUser = new UserModel({
      fullName: profile.displayName,
      facebookId: profile.id
    });
    theUser.save((err) => {
      if(err){
        next(err);
        return;
      }
      //now that they are saved, log them in.
      next(null,theUser);
    });
  }
);
  //receiving the facebook user info and saving it (unless we have already saved it then we just log them in)
  }
));

//passport google oath- login with google
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy(
  {  //1st arg is the settings object
    clientID: process.env.myGoogleClientID,
    clientSecret:process.env.myGoogleSecret,
    //this is the route user is redirected to from facebook after they log into facebook.
    callbackURL: '/auth/google/callback'
  },
  (accessToken,refreshToken,profile,next) => { //2nd arg is the callback, will be called when user alows us to log them in with facebook.
//console log the info we get from 3rd party services like facebook to see the structure and make srue I am using it correctly.
console.log("*************************************************");
console.log("profile");
UserModel.findOne(
  {googleId: profile.id},
  (err,userFromDb)=> {
    if(err){
      next(err);
      return;
    }
    //if this is first time user logs in with facebook userFromDb will be empty
    //check if they have logged in before if so just log them in.
    if(userFromDb){
      next(null,userFromDb);
      return;
    }
    //if have not logged in before, save them in the db!
    const theUser = new UserModel({
      fullName: profile.displayName,
      googleId: profile.id
    });
    if (theUser.fullName === undefined){
      theUser.fullName = profile.emails[0].value;
    }
    theUser.save((err) => {
      if(err){
        next(err);
        return;
      }
      //now that they are saved, log them in.
      next(null,theUser);
    });
  }
);
  //receiving the facebook user info and saving it (unless we have already saved it then we just log them in)
  }
));
