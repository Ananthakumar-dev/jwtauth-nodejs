const sharp = require('sharp');
const path = require('path');

const resizeWidth = 300;
const resizeHeight = 300;
const resizeFormat = 'jpeg';
const resizeQuality = 80;

exports.resizeImages = (files, outdirPath) => {
    if(files.length) {
        for(let file of files) {
            resize(file, outdirPath)
        }
    } else {
        resize(files, outdirPath)
    }
}

const resize = async (file, outdirPath) => {
    const filename = `${resizeWidth}x${resizeHeight}-${file.filename}`;
    const outputPath = path.join(outdirPath, filename);

    // Resize the image using sharp
    await sharp(file.path)
        .resize(resizeWidth, resizeHeight)
        .toFormat(resizeFormat) // Convert to JPEG
        .jpeg({ quality: resizeQuality }) // Set quality to 80
        .toFile(outputPath);

    return true;
}