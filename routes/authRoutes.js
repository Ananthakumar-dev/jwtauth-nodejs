const express = require('express')
const router = express.Router()

const registerValidation = require('../validators/registerValidation')
const loginValidation = require('../validators/loginValidation')
const validate = require('../middlewares/validate')
const { register, login} = require('../controllers/authController')


router.post('/register', registerValidation, validate, register)
router.post('/login', loginValidation, validate, login)

module.exports = router