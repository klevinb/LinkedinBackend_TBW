const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const { profile } = require("../profiles/schema");
//const v = require("validator")

const PostSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Please put the text for the post"],
    },
    image: String,
    username: {
      type: String,
      required: [true, "Please add the name of user"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "profile",
      required: [true, "Please add the id of user"],
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "profile" }],
  },
  { timestamps: true }
);
/* PostSchema.static("findPostsWithUsers", async function (id) {
    const post = await PostsModel.findOne({ _id:id }).populate("users")
}) */
/* PostSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400
    next(error)
  } else {
    next()
  }
}) */
const PostsModel = mongoose.model("Post", PostSchema);
module.exports = { PostsModel, PostSchema };
