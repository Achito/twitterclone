import express from "express";

import {getUserProfile, followUnfollowUser, getSuggestedUsers} from "../controllers/user.controller.js";

const router = express.Router();



router.get("/profile/:username", getUserProfile);
router.get("/suggested", getSuggestedUsers);
router.post("/follow/:userId", followUnfollowUser);

// router.post("/update", updateUserProfile);

export default router;