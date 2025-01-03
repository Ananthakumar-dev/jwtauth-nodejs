const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'secret';
const expiresIn = process.env.JWT_EXPIRES || '1h';

exports.sign = async (data) => {
    if(!data) throw new Error('Data not found to create jwt');

    return await jwt.sign(data, secret, { expiresIn });
}

exports.verify = async (token) => {
    if(!token) throw new Error('Token not found to verify');

    return await jwt.verify(token, secret);
}