const express = require('express')
const router = express.Router()
const { getUserDetails, updateUser, deleteUser } = require('../controllers/userController')
const userUpdateProfileValidation = require('../validators/userUpdateProfileValidation')
const validate = require('../middlewares/validate')

router
    .route('/')
    .get(getUserDetails)
    .put(userUpdateProfileValidation, validate, updateUser)
    .delete(deleteUser)

module.exports = router