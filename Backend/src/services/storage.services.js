import { ImageKit } from '@imagekit/nodejs';

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const uploadFile = async (file) => {
    const response = await client.files.upload({
        file: file.buffer.toString("base64"),
        fileName: file.originalname,
        folder: 'project-1/posto/',
    });

    return response;
};

export default uploadFile;
