import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import postController from '../controllers/post.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const route = express.Router();

route.post('/create', upload.single('media'), authMiddleware, postController.createPost);

route.patch('/:postId/like', authMiddleware, postController.toggleLike)

route.delete('/:postId',authMiddleware, postController.removePost)

route.get('/', postController.getPosts);

route.post('/create-comment/:postId',authMiddleware , postController.createComment);

route.get('/comment/:postId', postController.getComments);

route.delete('/:postId/comment/:commentId', authMiddleware, postController.deleteComment);

export default route;
