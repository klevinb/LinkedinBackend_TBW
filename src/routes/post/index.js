const express = require("express")
const {PostsModel}= require("./schema")
const router = express.Router()

router.get("/", async(req, res, next) => {
    try {
        const posts = await PostsModel.find(req.query).populate("users")
        res.send(posts)
    } catch (error) {
        next(error)
    }
})
router.post("/", async (req, res, next) => {
    try {
      const newPost = new PostsModel(req.body)
      const { _id } = await newPost.save()
  
      res.status(201).send(_id)
    } catch (error) {
      next(error)
    }
  })
  
  router.put("/:id", async (req, res, next) => {
    try {
      const post = await PostsModel.findByIdAndUpdate(req.params.id, req.body)
      if (post) {
        res.send("Ok")
      } else {
        const error = new Error(`post with id ${req.params.id} not found`)
        error.httpStatusCode = 404
        next(error)
      }
    } catch (error) {
      next(error)
    }
  })
  
  router.delete("/:id", async (req, res, next) => {
    try {
      const post = await PostsModel.findByIdAndDelete(req.params.id)
      if (post) {
        res.send("Deleted")
      } else {
        const error = new Error(`post with id ${req.params.id} not found`)
        error.httpStatusCode = 404
        next(error)
      }
    } catch (error) {
      next(error)
    }
  })
module.exports = router