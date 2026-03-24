import mongoose, { Schema } from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        mediaURL: {
            type: String,
        },
        caption: {
            type: String,
        },
        mediaType: {
            type: String,
            enum: ['video', 'image'],
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
