import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getPosts = async (req, res) => {
  try {
    const postId = req.params.postId;
    if (postId && postId !=="all") {

      const post = await Post.findById(postId);
      return res.status(200).json(post);
    }

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({ path: "comments.userId", select: "-password" });

    if (posts.length === 0) return res.status(200).json([]);

    return res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getPost Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createPost = async (req, res) => {
  try {
    let { text, image } = req.body;

    // Check if text or image is provided
    if (!text && !image) {
      return res.status(400).json({ error: "Text or image is required" });
    }

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      image = uploadResponse.secure_url;
    }

    const newPost = new Post({ text: text, img: image, user: req.user._id });
    const savedPost = await newPost.save();
    const populatedPost = await savedPost.populate("user", "username");

    res.status(201).json({
      post: populatedPost,
    });
  } catch (error) {
    console.log("Error in createPost Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(401).json({ error: "This post doesn't exist" });
    }

    if (post?.user?.toString() === req.user._id.toString()) {
      await post.delete();
      return res.status(200).json({ message: "Post deleted successfully" });
    } else {
      return res.status(401).json({ error: "You can delete only your post" });
    }

    // Check if post contains and image, then delete it from cloudinary
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost Controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const newComment = {
      text: text,
      user: req.user._id,
    };

    post.comments.push(newComment);
    await post.save();

    return res.status(201).json({ post });
  } catch (error) {
    console.log("Error in commentOnPost Controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    // Get the post
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user already liked the post
    const userLikedPost = post.likes.includes(req.user._id);

    // If already liked, then unlike the post
    if (userLikedPost) {
      //Unlike the post
      await Post.updateOne(
        { _id: req.params.postId },
        { $pull: { likes: req.user._id } }
      );
      await User.updateOne(
        { _id: req.user._id },
        { $pull: { likedPosts: req.params.postId } }
      );

      return res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like the post
      await Post.updateOne(
        { _id: req.params.postId },
        { $push: { likes: req.user._id } }
      );

      await User.updateOne(
        { _id: req.user._id },
        { $push: { likedPosts: req.params.postId } }
      );

      const notification = new Notification({
        from: req.user._id,
        to: post.userId,
        type: "like",
      });
      await notification.save();

      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.log("Error in likeUnlikePost Controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFollowingPosts = async (req, res) => {

  
  try {
    console.log(req.user.following);
    const feedPosts = await Post.find({ user: { $in: req.user.following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" });

      res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts", error);
    res.status(500).json({error: "Internal Server Error"});
  }
};
