import contactModel from '../models/contact.model.js';

const getContactData = async (req, res) => {
    try {
        const contact = await contactModel.create({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            subject: req.body.subject,
            message: req.body.message,
        });

        res.status(201).json({
            message: 'contact info created successfully',
            contact: contact,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to post contact details" });
    }
};

export default { getContactData };
