const express = require('express')
const bookValidation = require('../validators/bookValidation')
const validate = require('../middlewares/validate')
const { paramsMiddleware, getBooks, createBook, deleteBook, getBookById, updateBook } = require('../controllers/bookController')

const router = express.Router();

router.param('id', paramsMiddleware)

router
    .route('/')
    .get(getBooks)
    .post(bookValidation, validate, createBook)

router
    .route('/:id')
    .get(getBookById)
    .put(bookValidation, validate, updateBook)
    .delete(deleteBook)

module.exports = router;