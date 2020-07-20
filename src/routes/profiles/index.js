const express = require("express")
const q2m = require("query-to-mongo")
const profileSchema = require("./schema")
const router = express.Router()
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

const upload = multer();
const imagePath = path.join(__dirname, "../../public/img/profile");

router.get("/", async (req, res, next)=>{
    try{
        const query = q2m(req.query)
        const profiles = await profileSchema.find(query.criteria, query.options.fields)
        .skip(query.options.skip)
        .limit(query.options.limit)
        .sort(query.options.sort)
        res.send({
          data: profiles,
          total: profiles.length,
        })
    } catch (error){
        next(error)
    }
})

router.get("/:id", async (req, res, next)=>{
    try{
        const id = req.params.id
        const profile = await profileSchema.findById(id)
        if (profile) {
          res.send(profile)
        } else {
          const error = new Error()
          error.httpStatusCode = 404
          next(error)
        }
    } catch (error){
        next(error)
    }
})

router.post("/", async (req, res, next)=>{
    try{
    const newProfile = new profileSchema(req.body)
    const response = await newProfile.save()
    res.status(201).send(response)
    console.log(response)

    } catch (error){
        next(error)
    }
})

router.put("/:id", async (req, res, next)=>{
    try{
        const updatedprofile = await profileSchema.findByIdAndUpdate(req.params.id, req.body)
        console.log(updatedprofile)
        if (updatedprofile) {
          res.send(updatedprofile)
        } else {
          const error = new Error(`profile with id ${req.params.id} not found`)
          error.httpStatusCode = 404
          next(error)
        }
    } catch (error){
        next(error)
    }
})

router.post("/:id/upload", upload.single("profile"), async (req, res, next)=>{
    try{
        if (req.file) {
            await fs.writeFile(
              path.join(imagePath, `${req.params.id}.png`),
              req.file.buffer
            );
      
            const profile = await ProfileModel.findByIdAndUpdate(req.params.id, {
              image: `http://127.0.0.1:3003/img/profile/${req.params.id}.png`,
            });
            res.status(200).send("Done");
          } else {
            const err = new Error();
            err.httpStatusCode = 400;
            err.message = "Image file missing!";
            next(err);
          }
    } catch (error){
        next(error)
    }
})

router.get("/:id/exportToPDF", async (req, res, next)=>{
    try{

    } catch (error){
        next(error)
    }
})

router.delete("/:id", async(req, res, next) => {
    try {
        const profile = await profileSchema.findByIdAndDelete(req.params.id)
        if (profile) {
          res.send("Deleted")
        } else {
          const error = new Error(`profile with id ${req.params.id} not found`)
          error.httpStatusCode = 404
          next(error)
        }
      } catch (error) {
        next(error)
      }
})



module.exports = router