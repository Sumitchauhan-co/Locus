import { ImageKit } from '@imagekit/nodejs';
import { v2 as cloudinary } from 'cloudinary';
// import streamifier from 'streamifier'; // buffer to chunks (cloudinary)
import fs from 'fs';

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------- Uploaders --------------------

const uploadToImageKit = async ({ filePath, originalname }) => {
    // const fileBuffer = fs.readFileSync(filePath); // Read the file from the path
    const fileStream = fs.createReadStream(filePath);

    const response = await client.files.upload({
        file: fileStream,
        fileName: originalname,
        folder: 'locus/',
    });

    return response;
};

const uploadToCloudinary = async ({ filePath, originalname }) => {
    // Cloudinary handles the file path directly
    const response = await cloudinary.uploader.upload(filePath, {
        folder: 'locus/',
        public_id: originalname.split('.')[0],
        resource_type: 'auto',
    });

    return response;
};

// ----- buffer ------

// const uploadToImageKit = async ({ buffer, originalname }) => {
//     const response = await client.files.upload({
//         file: buffer.toString('base64'),
//         fileName: originalname,
//         folder: 'locus/',
//     });

//     return response;
// };

// const uploadToCloudinary = async ({ buffer, originalname }) => {
//     const response = new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//             {
//                 folder: 'locus/',
//                 public_id: originalname.split('.')[0],
//                 resource_type: 'auto',
//             },
//             (error, result) => {
//                 if (error) return reject(error);
//                 resolve(result);
//             },
//         );
//         streamifier.createReadStream(buffer).pipe(stream);
//     });
//     return response;
// };

// -------------------- Failover Wrapper --------------------

const uploadFile = async (fileData) => {
    let lastError;
    const providers = [
        { name: 'ImageKit', fn: uploadToImageKit },
        { name: 'Cloudinary', fn: uploadToCloudinary },
    ];

    for (const provider of providers) {
        try {
            const res = await provider.fn(fileData);

            // Note: Removed isValidMedia check to prevent CDN propagation errors
            console.log(`${provider.name} upload successful`);
            return res;
        } catch (error) {
            lastError = error;
            console.error(`${provider.name} failed:`, error.message || error);
        }
    }
    throw new Error(`All upload providers failed. Last Error: ${lastError}`);
};

export default uploadFile;
