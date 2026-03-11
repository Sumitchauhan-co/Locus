import { ImageKit } from '@imagekit/nodejs';

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const uploadFile = async ({buffer, originalname}) => {
    const response = await client.files.upload({
        file: buffer.toString("base64"),
        fileName: originalname,
        folder: 'project-1/posto/',
    });

    return response;
};

export default uploadFile;
