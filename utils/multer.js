const multer = require('multer')
const fs = require("node:fs");
const fsPromises = require('fs/promises')
const path = require('path');

const multerStorage = (baseDir, dynamicDir) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            let dirPath;
            if(dynamicDir) {
                const dynamicId = req.params.id;
                dirPath = path.join(process.cwd(), baseDir, dynamicId)
            } else {
                dirPath = path.join(process.cwd(), baseDir)
            }

            ensureDirExists(dirPath)

            cb(null, dirPath)
        },
        filename: (req, file, cb) => {
            const filename = `${Date.now()}-${file.originalname}`

            cb(null, filename)
        }
    })
}

const multerFilter = (type) => {
    return (req, file, cb) => {
        if(file.mimetype.startsWith(type)) {
            cb(null, true);
        } else {
            cb('Please upload image only', false)
        }
    }
}

// Function to ensure the directory exists
const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

exports.createUploadInstance = (dirPath, type = 'images', dynamicDir = false) => {
    const storage = multerStorage(dirPath, dynamicDir)
    const fileFilter = multerFilter(type)

    const upload = multer({
        storage,
        fileFilter
    })

    return upload;
}