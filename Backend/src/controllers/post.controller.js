import mongoose from 'mongoose';
import postModel from '../models/post.model.js';
import uploadFile from '../services/storage.services.js';
import compressImage from '../utils/compressImage.js';
import compressVideo from '../utils/compressVideo.js';
import fs from 'fs';
import authModel from '../models/auth.model.js';

const createPost = async (req, res) => {
    try {
        const caption = req.body.caption;
        const file = req.file;

        if (!file && (!caption || caption.trim() === '')) {
            return res.status(400).json({
                message: 'Post must have either media or caption',
            });
        }

        let mediaURL = null;
        let mediaType = null;

        if (file) {
            const mime = file.mimetype;
            let buffer;

            if (!mime.startsWith('image') && !mime.startsWith('video')) {
                return res.status(400).json({
                    message: 'Only image or video uploads are allowed',
                });
            }

            if (mime.startsWith('image')) {
                buffer = await compressImage(file);
                mediaType = 'image';
            }

            if (mime.startsWith('video')) {
                const inputPath = `public/temp/${Date.now()}-${file.originalname}`;
                const outputPath = `public/temp/compressed-${Date.now()}.mp4`;

                fs.writeFileSync(inputPath, file.buffer);

                await compressVideo(inputPath, outputPath);

                buffer = fs.readFileSync(outputPath);

                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);

                mediaType = 'video';
            }

            const result = await uploadFile({
                buffer,
                originalname: file.originalname,
            });

            mediaURL = result.url;
        }

        const post = await postModel.create({
            mediaURL,
            mediaType,
            caption: caption || '',
            user: req.user,
            likesCount: [],
        });

        return res.status(201).json({
            message: 'Post created successfully',
            post,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create post' });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await postModel
            .find()
            .sort({ createdAt: -1 })
            .populate('user', 'username email');

        return res.status(200).json({
            message: 'data fetched successfully',
            posts: posts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to get posts' });
    }
};

const toggleLike = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.postId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid Post ID format' });
        }

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const isLiked = post.likesCount.includes(userId);

        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            isLiked
                ? { $pull: { likesCount: userId } }
                : { $addToSet: { likesCount: userId } },
            { returnDocument: 'after' },
        );

        res.json({
            likesCount: updatedPost.likesCount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to update like' });
    }
};

const removePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid Post ID format' });
        }

        const isAdmin = req.user.email === 'chauhan.sumit3012@gmail.com';

        let deletedPost;

        let deletedPostFromAdmin;

        if (isAdmin) {
            deletedPostFromAdmin = await postModel.findOneAndDelete({
                _id: postId,
            });
        } else {
            deletedPost = await postModel.findOneAndDelete({
                _id: postId,
                user: req.user._id,
            });
        }

        if (!deletedPost) {
            const postExists = await postModel.findById(postId);
            if (!postExists) {
                return res.status(404).json({ message: 'Post not found' });
            } else {
                return res.status(403).json({ message: 'Unauthorized' });
            }
        }

        res.status(200).json({
            message: 'Successfully deleted the post',
            post: deletedPost || deletedPostFromAdmin,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete post' });
    }
};

const createComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.postId;
        const text = req.body.text;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid Post ID format' });
        }

        if (!text) {
            return res
                .status(400)
                .json({ message: 'Empty comments are Invalid' });
        }

        const user = await authModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        userId,
                        username: user.username,
                        text,
                    },
                },
            },
            { new: true },
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = updatedPost.comments[updatedPost.comments.length - 1];

        res.status(201).json({
            message: 'Comment added successfully',
            comment: newComment,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server failed to add comment' });
    }
};


export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user._id;
        const userEmail = req.user.email;

        // 1. Find the post
        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // 2. Find the comment
        const comment = post.comments.find(
            (c) => c._id.toString() === commentId,
        );

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // 3. Authorization
        const isCommentOwner = comment.userId.toString() === userId.toString();
        const isAdmin = userEmail === 'chauhan.sumit3012@gmail.com';

        if (!isCommentOwner && !isAdmin) {
            return res
                .status(403)
                .json({ message: 'Unauthorized to delete this comment' });
        }

        post.comments.pull(commentId);

        await post.save();

        res.status(200).json({
            message: 'Comment deleted successfully',
            comments: post.comments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid Post ID' });
        }

        const post = await postModel.findById(postId).select('comments');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({
            message: 'Comments fetched successfully',
            comments: post.comments,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server failed to fetch comments' });
    }
};

export default {
    createPost,
    getPosts,
    toggleLike,
    removePost,
    createComment,
    deleteComment,
    getComments,
};
