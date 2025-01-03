const bcrypt = require('bcrypt');

const saltRounds = Number(process.env.BCRYPT_SALT || 10);

exports.encrypt = (password) => {
    const salt = bcrypt.genSaltSync(
        saltRounds
    );

    return bcrypt.hashSync(password, salt);
}

exports.decrypt = (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
}