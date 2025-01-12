import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

// Get user -> router.get("/profile/:username", getUserProfile);
export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile Controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const userToModify = await User.findById(userId);
    const currentUser = await User.findById(req.user._id);

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ error: "You cant follow yourself" });
    }

    if (!userToModify) return res.status(400).json({ error: "User not found" });

    //Check if is following, then act accordingly
    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      // REMOVE the follower to the user followed
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: req.user._id },
      });

      // REMOVE the following to current User
      await User.findByIdAndUpdate(currentUser, {
        $pull: { following: userId },
      });

      // Send confirmation message
      return res.status(200).json({ message: "Unfollowed correctly" });
    } else {
      // ADD the follower to the user followed
      await User.findByIdAndUpdate(userId, {
        $push: { followers: req.user._id },
      });

      // ADD the following to current User
      await User.findByIdAndUpdate(currentUser, {
        $push: { following: userId },
      });

      // Send a notificiation to the user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();

      // TO DO: return de if of the user as a response

      return res.status(200).json({ message: "Followed correctly" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser Controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("following");

    // Select 10 users that doesn't include Current User itself (ne -> not equal)
    const users = await User.aggregate([
      { $match: { _id: { $ne: userId } } },
      { $sample: { size: 10 } },
      { $project: { password: 0 } },
    ]);

    // From sample above (users) filter just to not include already followed users
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in suggestedUser Controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { username, fullName, email, bio, link, profileImg, coverImg } =
      req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (username) user.username = username;
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (link) user.link = link;

    if (profileImg) {
      if (user.profileImg) {
        // Delete the previous image from Cloudinary
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const uplodadedResponse = await cloudinary.uploader.upload(profileImg);
      user.profileImg = uplodadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        // Delete the previous image from Cloudinary
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const uplodadedResponse = await cloudinary.uploader.upload(coverImg);
      user.coverImg = uplodadedResponse.secure_url;
    }

    await user.save();

    // Remove password from the response
    user.password = undefined;

    res
      .status(200)
      .json({ user: user, message: "Profile updated successfully" });
  } catch (error) {
    console.log("Error in updateUserProfile Controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const { username } = req.params || "";

    const user = awaitUser.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user);

    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.userId", select: "-password" });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    console.log(req.params.username);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.userId", select: "-password" });

    return res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
