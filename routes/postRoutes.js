const express = require("express")
const {makePost, getAllPosts, getPostById, getPostsByKeyword, updatePostById, deletePostById} = require("../controllers/postController")
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send("<h1>Welcome to my Blog API! :D</h1>")
})

router.post('/articles', makePost)
router.get('/articles', getAllPosts)
router.get('/articles/search', getPostsByKeyword)
router.get('/articles/:id', getPostById)
router.put('/articles/:id', updatePostById)
router.delete('/articles/:id', deletePostById)

module.exports = router