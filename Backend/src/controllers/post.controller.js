import postModel from '../models/post.model.js';
import uploadFile from '../services/storage.services.js';

const createPost = async (req, res) => {
    try {
        const result = await uploadFile(req.file.buffer.toString('base64'));

        const post = await postModel.create({
            imageID: result.url,
            caption: req.body.caption,
        });

        res.status(201).json({
            message: 'post created successfully',
            post: post,
        });
    } catch (error) {
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
        
        res.status(500).json({message: "Failed to get posts"})
    }
};

export default { createPost, getPosts };
