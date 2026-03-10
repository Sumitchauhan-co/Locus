import postModel from '../models/post.model.js';
import uploadFile from '../services/storage.services.js';

const createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Media file is required',
            });
        }

        const mime = req.file.mimetype;

        if (!mime.startsWith('image') && !mime.startsWith('video')) {
            return res.status(400).json({
                message: 'Only image or video uploads are allowed',
            });
        }
        const result = await uploadFile(req.file);

        const mediaType = mime.startsWith('video') ? 'video' : 'image';

        const post = await postModel.create({
            mediaURL: result.url,
            mediaType,
            caption: req.body.caption,
        });

        res.status(201).json({
            message: 'post created successfully',
            post: post,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create post' });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await postModel.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'data fetched successfully',
            posts: posts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to get posts' });
    }
};

export default { createPost, getPosts };
