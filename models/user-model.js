const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const myUserSchema = new Schema(
  {                           //1st arg: structure of the object
  fullName: {type: String},

  //only applies to sign up /log in form users
  username: {type: String},
  encryptedPassword: {type: String},

  //for google users
  googleID: {type:String},

  //for facebook users
  facebookID: {type: String}

},
{
  //2nd arg: additional settings (optional)
  timestamps: true
  //timestamps creates 2 additional fields: createdAt and updatedAt, this second one is updated when log in.
}
);

const UserModel = mongoose.model('User', myUserSchema);
                                 //User -> users collection -> db.users.find() in mongo.
module.exports= UserModel;
