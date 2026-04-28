import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            const isOauth = this.googleId;
            return !isOauth;
        },
    },
    googleId: {
        type: String,
        default: null,
    },
    refreshToken: {
        type: String,
    },
});

const authModel = mongoose.model('Auth', authSchema);

export default authModel;
