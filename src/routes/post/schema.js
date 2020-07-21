const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const { profile } = require("../profiles/schema");

const PostSchema = new Schema(
  {
    text: String,
    image: String,
    username: String,

    user: { type: Schema.Types.ObjectId, ref: "profile" },
  },
  { timestamps: true }
);
/* PostSchema.static("findPostsWithUsers", async function (id) {
    const post = await PostsModel.findOne({ _id:id }).populate("users")
}) */
const PostsModel = mongoose.model("Post", PostSchema);
module.exports = PostsModel;
