import express from 'express';

import { getPosts, createPost, commentOnPost,likeUnlikePost,deletePost, getFollowingPosts} from '../controllers/post.controller.js';



const router = express.Router();





router.get('/following', getFollowingPosts);
router.get('/:postId', getPosts);
// Get all comments from a Post
router.post('/:postId/comments',commentOnPost);
// Get all likes from a post
router.post('/:postId/likes',likeUnlikePost);
router.get('/', getPosts);
router.post('/',createPost);
router.delete('/:postId',deletePost);   


export default router;