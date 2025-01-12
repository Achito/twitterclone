import express from "express";

import {getUserProfile, followUnfollowUser, getSuggestedUsers, getLikedPosts, getUserPosts} from "../controllers/user.controller.js";

const router = express.Router();



router.get("/profile/:username/posts", getUserPosts);
router.get("/profile/:username", getUserProfile);
router.get("/profile/:username/liked", getLikedPosts);
router.get("/suggested", getSuggestedUsers);
router.post("/follow/:userId", followUnfollowUser);
//TO DO: Need to implement
// router.post("/update", updateUserProfile);

export default router;