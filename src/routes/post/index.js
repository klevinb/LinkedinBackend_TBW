const express = require("express")
const {PostsModel}= require("./schema")
const router = express.Router()
const multer = require("multer")
const upload = multer({})
const { join } = require("path")
const { writeFile } = require("fs-extra")
const fs = require('fs-extra')

const imgFolderPath = join(__dirname, "../../public/img/posts/")
const imgFolderPath1 = join(__dirname, "../../public/img/posts/Koala.jpg")



router.get("/", async(req, res, next) => {
    try {
        const posts = await PostsModel.find(req.query).populate("user")
        res.send(posts)
    } catch (error) {
        next(error)
    }
})

router.get("/:id", async(req, res, next) => {
  try {
    const id = req.params.id
    const post = await PostsModel.findById(id)
    if (post) {
      res.send(post)
    } else {
      const error = new Error()
      //error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading post a problem occurred!")
    
  }
})
router.post("/", async (req, res, next) => {
    try {
      const newPost = new PostsModel(req.body)
      const { _id } = await newPost.save()
      //{ runValidators: true }
  
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
      const post = await PostsModel.findByIdAndDelete (req.params.id)
      if(post){
        fs.unlink(imgFolderPath + `${req.params.id}.png`, (err) => {
          if (err) {
          
            console.log("failed to delete local image:"+ err);
            res.status(404).send('Not Found')
        } else {
          res.status(200).send('Deleted')                                
        }
        })
      
      
     
          //const deleteImg = await fs.emptyDir (imgFolderPath);

      
      
      
      } else {
        const error = new Error(`post with id ${req.params.id} not found`)
        error.httpStatusCode = 404
        next(error)
      }
    } catch (error) {
      next(error)
    }
  })

  // for upload (single)
  /* router.post(
    "/:id/upload",
    upload.single("picture"),
    async (req, res, next) => {
      try {
        await fs.writeFile(
          join(imgFolderPath, `${req.params.id}.png`),
          req.file.buffer
        );
  
        const savePicture = await PostsModel.findByIdAndUpdate(
          { _id: req.params.id },
          {
            image: `http://localhost:${process.env.PORT}/img/posts/${req.params.id}.png`,
          }
        );
        if (savePicture) res.status(201).send("Uploaded");
        else res.status(400).send("Something went wrong");
      } catch (error) {
        console.log(error);
      }
    }
  ); */


 router.post("/:id/upload", upload.array("avatar"), async(req, res, next) =>{
       try {
        const arrayOfPromises = req.files.map((file) => writeFile (join(imgFolderPath, `${req.params.id}.png`), file.buffer))
        /* await fs.writeFile(
          join(imgFolderPath, `${req.params.id}.png`),
          file.buffer
        ); */
  
        const savePicture = await PostsModel.findByIdAndUpdate(
          { _id: req.params.id },
          {
            image: `http://localhost:${process.env.PORT}/img/posts/${req.params.id}.png`,
          }
        );
        if (savePicture) res.status(201).send("Uploaded");
        else res.status(400).send("Something went wrong");
      } catch (error) {
        console.log(error);
      }
    }
  )

  /* router.post("/:id/upload", upload.array("avatar"), async(req, res, next) =>{
      try {
          const arrayOfPromises = req.files.map((file) => writeFile (join(imgFolderPath, `${req.params.id}.png`), file.buffer))
          await Promise.all(arrayOfPromises)
          res.send(200).send("uploaded")
      } catch (e) {
        next(e)          
      }
  }) */

  router.get('/:id/delete', async (req, res) => {
    try{      
      const imgDelete = await PostsModel.findById({ _id: req.params.id},function(err,data){ 
        if (err) throw err;
        fs.emptyDir (imgFolderPath);
     })
     res.send("Deleted")
     }catch(err){
      console.log(err);
     }
});



module.exports = router