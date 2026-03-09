import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    imageID : String,
    caption: String,
}, {timestamps: true})

const postModel = mongoose.model("post", postSchema)

export default postModel