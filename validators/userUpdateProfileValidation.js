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
];

module.exports = registerValidation;
