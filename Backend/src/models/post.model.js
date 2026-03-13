import mongoose, { Schema } from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        mediaURL: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
            required: true,
        },
        mediaType: {
            type: String,
            enum: ['video', 'image'],
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Auth',
            required: true,
        },
        likesCount: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Auth',
                default: [],
            },
        ],
    },
    { timestamps: true },
);

const postModel = mongoose.model('Post', postSchema);

export default postModel;
