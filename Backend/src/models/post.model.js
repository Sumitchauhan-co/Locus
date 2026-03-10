import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    mediaURL : String,
    caption: String,
    mediaType: String,
}, {timestamps: true})

const postModel = mongoose.model("post", postSchema)

export default postModel