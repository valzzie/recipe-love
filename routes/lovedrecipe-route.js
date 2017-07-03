const express= require('express');
const RoomModel= require('../models/room-model.js');
const router= express.Router();
// to be able to upload images to this route
const multer= require('multer');
// to save user uploaded files in a specific folder
const myUploader = multer({
  //dest is the detination that specifies where to put the uploaded files
  dest: __dirname + '/../public/uploads/'
});
router.get('/rooms/new', (req,res,next) => {
  //any page that should only be
  if (req.user){
  res.render('room-views/new-room-view.ejs');
}
else {
  res.redirect('/login');
}
});
// route below includes NEW stuff so i can upload files, should add a new folder to my public called uploads.
//if open the npm public/uploads/ can see the image in there.
router.post(
  '/rooms',
  // must put input name here in parens so on form use recipePhoto or else change the name below.
  myUploader.single('recipephoto'),//this is just to show where the above stuff is located within the code.
  (req,res,next) => {
    console.log('***********************************************************');
    console.log('req.file(file upload from multer)');
    const theRoom = new RoomModel({
      name: req.body.roomName,
      description: req.body.roomDescription,
      photUrl: '/uploads/' + req.file.filename,
      owner: requ.user._id
    });
  });
  router.get('/my-rooms', (req,res,next) => {
    RoomModel.find(
      // find the rooms owned by the logged in user.   we want the current owner of the room
      {owner: req.user._id},
      (err,roomResults) => {
        if (err) {
          next(err);
          return;
        }
        res.locals.roomsAndStuff= roomResults;

  res.render('room-views/room-list-view.ejs');
  }
  );
  });

  module.exports= router;
