const express = require('express')
const router = express.Router()
const { getUserDetails, updateUser, deleteUser, uploadUserPhoto } = require('../controllers/userController')
const userUpdateProfileValidation = require('../validators/userUpdateProfileValidation')
const validate = require('../middlewares/validate')
const { createUploadInstance } = require('../utils/multer')
const createRateLimiter = require('../middlewares/rateLimiter')

// Configure rate limiter (10 requests per minute)
const rateLimiter = createRateLimiter(5, 60 * 1000);
router.use(rateLimiter)

router
    .route('/')
    .get(getUserDetails)
    .put(userUpdateProfileValidation, validate, updateUser)
    .delete(deleteUser);

router
    .route('/upload-photo')
    .post(
        createUploadInstance('public/images/users', 'image').single('photo'),
        uploadUserPhoto
    )

module.exports = router