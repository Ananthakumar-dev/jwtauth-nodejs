const express = require('express')
const bookValidation = require('../validators/bookValidation')
const validate = require('../middlewares/validate')
const { paramsMiddleware, getBooks, createBook, deleteBook, getBookById, updateBook, uploadBooksPhotos } = require('../controllers/bookController')
const {createUploadInstance} = require("../utils/multer");

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

router
    .route('/:id/upload-photos')
    .post(
        createUploadInstance('public/images/books', 'image', true).array('photos'),
        uploadBooksPhotos
    )

module.exports = router;