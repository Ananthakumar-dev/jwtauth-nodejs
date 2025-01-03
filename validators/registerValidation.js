const { body } = require('express-validator');

const registerValidation = [
    body('username')
        .notEmpty()
        .withMessage('Username is required.')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 20 characters.'),

    body('email')
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Email must be a valid email address.'),

    body('password')
        .notEmpty()
        .withMessage('Password is required.')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long.')
];

module.exports = registerValidation;
