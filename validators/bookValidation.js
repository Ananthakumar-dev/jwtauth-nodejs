const { body } = require('express-validator');

const registerValidation = [
    body('title')
        .notEmpty()
        .withMessage('Title is required.')
        .isLength({ min: 3, max: 255 })
        .withMessage('Title must be between 3 and 255 characters.'),
];

module.exports = registerValidation;
