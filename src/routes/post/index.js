const express = require("express")
const {PostsModel}= require("./schema")
const router = express.Router()
const multer = require("multer")
const upload = multer({})
const { join } = require("path")
const { writeFile } = require("fs")

const imgFolderPath = join(__dirname, "../../public/")

router.get("/", async(req, res, next) => {
    try {
        const posts = await PostsModel.find(req.query).populate("user")
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

  // for upload (multiple)
  router.post("/:id/upload", upload.array("avatar"), async(req, res, next) =>{
      try {
          const arrayOfPromises = req.files.map((file) =>
          writeFile(join(imgFolderPath, file.originalname), file.buffer))
          await Promise.all(arrayOfPromises)
          res.send(200).send("uploaded")
      } catch (e) {
        next(e)          
      }
  })
module.exports = router