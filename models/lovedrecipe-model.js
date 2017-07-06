const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const myRecipeSchema = new Schema(
  {                           //1st arg: structure of the object
  recipename: {type: String, required: [true, 'Please enter the name of this recipe']},
  recipesource: {type: String, required: [true, 'Please enter the source of this specific recipe']},
  sourcelink: {type: String},
  photoUrl: {type: String, default:'/images/damien-creatz-161787.jpg'},
  recipecategory: {type: String},
  recipecomment: {type: String},
  recipetags:[ {type:String} ],
//we are going to refer to the owner of the room below, since rooms will be thier own collection and owners will be own collection.
//but the collections should refer to eachother.
  owner: {type: Schema.Types.ObjectId}



},
{
  //2nd arg: additional settings (optional)
  timestamps: true
  //timestamps creates 2 additional fields: createdAt and updatedAt, this second one is updated when log in.
}
);

const RecipeModel = mongoose.model('Recipe', myRecipeSchema);
                                 //User -> users collection -> db.users.find() in mongo.
module.exports= RecipeModel;
