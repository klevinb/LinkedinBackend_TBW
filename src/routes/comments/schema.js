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
    postid: {
      type: String,
      required: [true, "Please add the id of the post"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "profile",
      required: [true, "Please add the id of user"],
    },
  },
  { timestamps: true }
);

const CommentsModel = mongoose.model("Comment", CommentSchema);
module.exports = { CommentsModel, CommentSchema };
