const Joi = require("joi")
const postModel = require("../models/postModel")

const makePost = async (req, res, next) => {
  const postSchema = Joi.object({
    title: Joi.string().min(5).max(200).required(),
    opening: Joi.string().min(3).default("An interesting post!"),
    subhead: Joi.string().min(5).required(),
    content: Joi.string().min(20).required(),
    author: Joi.string().optional().default("Guest"),
  })

  const {error, value} = postSchema.validate(req.body)
  if(error) return res.status(400).json({Error: "Please provide post title, subhead and content."})
  try {
    const newPost = new postModel(value)
    await newPost.save()
    return res.status(200).json({Message: "Post created.", Data: newPost})
  } catch (error) {
    console.error(error)
    next(error)
  }
}
const getAllPosts = async (req, res, next) => {
  const {limit = 10, page = 1} = req.query
  const skip = (page - 1) * limit
  try {
    const posts = await postModel.find({}).sort({createdAt: -1}).limit(limit).skip(skip)

    return res.status(200).json({
      Message: "Posts fetched",
      Data: posts
    })
    
  } catch (error) {
    console.error(error)
    next(error)
  }
}
const getPostById = async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id)

    if(!post) return res.status(404).json({Message: `Post with ID ${req.params.id} does not exist`})
    return res.status(200).json({Message: "Post found.", Data: post})
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getPostsByKeyword = async (req, res, next) => {
  const {q} = req.query
  try {
    if(!q) return res.status(400).json({Message: "Please include the search keyword"})
    const matches = await postModel.find({$text: {$search : q}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})
    res.status(200).json({Keyword: q, Matches: matches})
  } catch (error) {
    next(error)
  }
}

const updatePostById = async (req, res, next) => {
  try {
    const postSchema = Joi.object({
      title: Joi.string().min(5).optional(),
      opening: Joi.string().min(5).optional(),
      subhead: Joi.string().min(5).optional(),
      content: Joi.string().min(20).optional(),
      author: Joi.string().optional(),
   })

    const {error} = postSchema.validate(req.body)
    if(error || !req.body) return res.status(400).json({Error: "Please provide information to be replaced."})
    const updatedPost = await postModel.findByIdAndUpdate(req.params.id, {...req.body}, {new: true, runValidators: true})

    if (!updatedPost) return res.status(404).json({Message: `Post with ID ${req.params.id} does not exist`})
    return res.status(200).json({Message: "Post updated", Data: updatedPost})
  } catch (error) {
    console.error(error)
    next(error)
  }
}
const deletePostById = async (req, res, next) => {
  try {
    const post = await postModel.findByIdAndDelete(req.params.id)
    if(!post) res.status(404).json({Message: `Post with ID ${req.params.id} does not exist`})
    return res.status(200).json({Message: "Post deleted successfully."})
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {makePost, getAllPosts, getPostById, getPostsByKeyword, updatePostById, deletePostById}