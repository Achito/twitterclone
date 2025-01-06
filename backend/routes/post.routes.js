import express from 'express';

import { getPosts, createPost, commentOnPost,likeUnlikePost,deletePost} from '../controllers/post.controller.js';



const router = express.Router();



router.get('/:postId', getPosts);
router.get('/', getPosts);

router.post('/:postId/comments',commentOnPost);
router.post('/:postId/likes',likeUnlikePost);

router.post('/',createPost);
router.delete('/:postId',deletePost);   


export default router;