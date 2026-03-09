import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
});

const contactModel = mongoose.model('contact', contactSchema);

export default contactModel
