import sharp from 'sharp';

const compressImage = async (file) => {
    const outputPath = `public/temp/compressed-${Date.now()}-${file.originalname}`;
    await sharp(file.buffer)
        .resize({ width: 1080 })
        .jpeg({ quality: 70 })
        .toFile(outputPath);
        // .toBuffer()

    return outputPath;
};

export default compressImage;
