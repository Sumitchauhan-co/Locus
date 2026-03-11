import sharp from 'sharp';

const compressImage = async (file) => {
    const buffer = await sharp(file.buffer)
        .resize({ width: 1080 }) 
        .jpeg({ quality: 70 })
        .toBuffer();

    return buffer;
};

export default compressImage;
