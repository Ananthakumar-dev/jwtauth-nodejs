const fsPromises = require('fs/promises');
const nodePath = require('path');

exports.removeDir = async (path) => {
    try {
        const fullyQualifiedPath = nodePath.join(process.cwd(), path);

        await fsPromises.rm(
            fullyQualifiedPath,
            { recursive: true, force: true }
        );
    } catch(error) {
        console.error(error.message || 'Error while deleting directory')

        return false;
    }

    return true;
}