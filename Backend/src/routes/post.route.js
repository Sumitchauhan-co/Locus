import express from 'express';
import multer from 'multer';
import postController from '../controllers/post.controller.js';

const route = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

route.post('/create-post', upload.single('image'), postController.createPost);

route.get('/', postController.getPosts);

export default route;
