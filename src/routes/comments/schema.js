const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const { profile } = require("../profiles/schema");
//const v = require("validator")

const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: [true, "Please comment, if you have any suggestion"],
    },   
    username: {
      type: String,
      required: [true, "Please add the name of user"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "profile",
      required: [true, "Please add the id of user"],
    },
  },
  { timestamps: true }
);
/* CommentSchema.static("findCommentsWithUsers", async function (id) {
    const Comment = await CommentsModel.findOne({ _id:id }).populate("users")
}) */
/* CommentSchema.Comment("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400
    next(error)
  } else {
    next()
  }
}) */
const CommentsModel = mongoose.model("Comment", CommentSchema);
module.exports = { CommentsModel, CommentSchema };
