const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  title: {type: String, required: true, minlength: 5},
  opening: {type: String, default: "An interesting post!", minlength: 3},
  subhead: {type: String, required: true, minlength: 5},
  content: {type: String, required: true, minlength: 20},
  author: {type: String, default: "Anonymous"}
},
{timestamps: true})

postSchema.index({
  title: "text",
  subhead: "text",
  content: "text"
})

module.exports = mongoose.model('Post', postSchema)