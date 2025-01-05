const jwt = require('jsonwebtoken')
const { verify } = require('../utils/jwt')

module.exports = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = await verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(error) {
        res.status(400).json({ error: error.message || 'Invalid token' });
    }
};