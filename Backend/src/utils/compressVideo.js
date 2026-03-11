import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegPath);

const compressVideo = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .outputOptions([
                '-vcodec libx264',
                '-crf 28',
                '-preset fast',
                '-movflags +faststart',
            ])
            .save(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', reject);
    });
};

export default compressVideo;
