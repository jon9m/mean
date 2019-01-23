const mongoose = require('mongoose');

//Bluprint
const postSchema = mongoose.Schema({
  title: { type: String, required: true },  //String Capital S
  content: { type: String, required: true },
  imagepath: { type: String, required: true }
});

//Model
module.exports = mongoose.model('Post', postSchema);  //Uppercase P
