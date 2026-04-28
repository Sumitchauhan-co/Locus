import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates:{
            type: [Number],
            required: true,
        },
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
    
})

locationSchema.index({ location: '2dsphere' });

const locationModel = mongoose.model("location", locationSchema)

export default locationModel