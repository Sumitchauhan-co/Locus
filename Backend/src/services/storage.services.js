import { ImageKit } from '@imagekit/nodejs';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------- Uploaders --------------------

const uploadToImageKit = async ({ buffer, originalname }) => {
    const response = await client.files.upload({
        file: buffer.toString('base64'),
        fileName: originalname,
        folder: 'project-1/locus/',
    });

    return response;
};

const uploadToCloudinary = async ({ buffer, originalname }) => {
    const response = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'project-1/locus/',
                public_id: originalname.split('.')[0],
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            },
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
    return response;
};

// -------------------- Failover Wrapper --------------------

const providers = [uploadToImageKit, uploadToCloudinary];

const isValidMedia = async (url) => {
    try {
        const res = await fetch(url, { method: 'HEAD' });

        return res.ok;
    } catch {
        return false;
    }
};

const uploadFile = async (file) => {
    let lastError;
    for (const provider of providers) {
        try {
            const res = await provider({ ...file });

            const valid = await isValidMedia(res.url);

            if (!valid) {
                throw new Error('Media not accessible');
            }

            console.log(`${provider.name} is working`);
            return res;

        } catch (error) {
            lastError = error;
            console.log(`${provider.name} failed:`, error.message);
        }
    }
    throw new Error(`All upload providers failed! , Error : ${lastError}`);
};

export default uploadFile;
