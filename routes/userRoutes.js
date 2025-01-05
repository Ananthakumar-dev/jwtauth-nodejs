const express = require('express')
const router = express.Router()
const { getUserDetails, updateUser, deleteUser, uploadUserPhoto } = require('../controllers/userController')
const userUpdateProfileValidation = require('../validators/userUpdateProfileValidation')
const validate = require('../middlewares/validate')
const { createUploadInstance } = require('../utils/multer')

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