import { ImageKit } from '@imagekit/nodejs';

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const uploadFile = async (file) => {
    const response = await client.files.upload({
        file,
        fileName: 'photo_' + Date.now(),
        folder: 'project-1/posto/',
    });

    return response;
};

export default uploadFile;
