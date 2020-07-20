const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const PostSchema = new Schema({
    
    text: String,
    image: String,
    username: String,
   
    users: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
    
},
  { timestamps: true }
)
PostSchema.post("findPostsWithUsers", async function (id) {
    const post = await PostsModel.findOne({ _id:id }).populate("users")
})
const PostsModel = mongoose.model("Post", PostSchema)
module.exports = {PostsModel, PostSchema}