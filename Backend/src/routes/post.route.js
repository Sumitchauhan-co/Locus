import express from 'express';
import multer from 'multer';
import postController from '../controllers/post.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const route = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'video/mp4',
            'video/webm',
            'video/quicktime',
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'), false);
        }
    },
});

route.post('/create', upload.single('media'), authMiddleware, postController.createPost);

route.patch('/:postId/like', authMiddleware, postController.toggleLike)

route.delete('/:postId',authMiddleware, postController.removePost)

route.get('/', postController.getPosts);

route.post('/create-comment/:postId',authMiddleware , postController.createComment);

route.get('/comment/:postId', postController.getComments);

route.delete('/:postId/comment/:commentId', authMiddleware, postController.deleteComment);

export default route;
