import { timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";

const postSchema = new mongoose.Schema({
  text: { type: String },
  img: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  comments: [
    {
      text: { type: String, required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    },
  ],
}, {timestamps:true});

const Post = mongoose.model("Post", postSchema);

export default Post;


