const pool = require('../config/database')
const catchAsync = require('../utils/catchAsync')
const path = require("node:path");
const { resizeImages } = require("../utils/sharp");

exports.paramsMiddleware = async (req, res, next, value) => {
    const bookId = value;

    if(!bookId) {
        res.status(404).json({
            status: false,
            message: 'BookId is required',
        })
    }

    let [ bookFound ] = await pool.query(
        'SELECT COUNT(*) AS bookCount FROM books WHERE id = ?',
        [ bookId ]
    );

    bookFound = bookFound.at(0)?.bookCount

    if(!bookFound) {
        res.status(404).json({
            status: false,
            message: 'Book not found',
        })
    }

    next();
}

exports.getBooks = catchAsync(async (req, res) => {
    const user_id = req?.user?.id || null

    if(!user_id) {
        res.status(404).json({
            status: true,
            message: 'User Not found'
        })
    }

    const [ result ] = await pool.query(
        "SELECT books.id, user_id, title, description, GROUP_CONCAT(book_files.name SEPARATOR ' | ') AS files FROM books LEFT JOIN book_files ON books.id = book_files.book_id WHERE books.user_id = ? GROUP BY books.id",
        [ user_id ]
    );

    res.status(200).json({
        status: true,
        data: {
            books: result
        },
    })
})

exports.createBook = catchAsync(async(req, res) => {
    const user_id = req?.user?.id || null

    if(!user_id) {
        res.status(404).json({
            status: true,
            message: 'User Not found'
        })
    }

    const { title, description } = req.body;
    const [ result ] = await pool.query(
        'INSERT INTO books (user_id, title, description) VALUES (?, ?, ?)',
        [ user_id, title, description ]
    )

    if(result.insertId) {
        res.status(201).json({
            status: true,
            message: 'Book created successfully',
            data: {
                bookId: result.insertId
            }
        })
    } else {
        res.status(500).json({
            status: false,
            message: 'Something went wrong while insert book'
        })
    }
});

exports.getBookById = catchAsync(async (req, res) => {
    const user_id = req?.user?.id || null
    const bookId = req.params.id

    if(!user_id) {
        res.status(404).json({
            status: true,
            message: 'User Not found'
        })
    }

    const [ result ] = await pool.query(
        "SELECT books.id, user_id, title, description, GROUP_CONCAT(book_files.name SEPARATOR ' | ') AS files FROM books LEFT JOIN book_files ON books.id = book_files.book_id where books.id = ? AND user_id = ? GROUP BY books.id",
        [ bookId, user_id ]
    );

    res.status(200).json({
        status: true,
        message: 'Books details listed',
        data: {
            books: result.at(0)
        },
    })
})

exports.updateBook = catchAsync(async (req, res) => {
    const user_id = req?.user?.id || null
    const bookId = req.params.id

    if(!user_id) {
        res.status(404).json({
            status: true,
            message: 'User Not found'
        })
    }

    const { title, description } = req.body;

    const [ result ] = await pool.query(
        'UPDATE books SET title = ?, description = ? WHERE user_id = ? AND id = ?',
        [ title, description, user_id, bookId ]
    );

    if(result.affectedRows) {
        res.status(201).json({
            status: true,
            message: 'Book updated successfully'
        })
    } else {
        res.status(404).json({
            status: false,
            message: 'Something went wrong while update book',
        })
    }
})


exports.deleteBook = catchAsync(async (req, res) => {
    const user_id = req?.user?.id || null
    const bookId = req.params.id

    if(!user_id) {
        res.status(404).json({
            status: true,
            message: 'User Not found'
        })
    }

    const [ result ] = await pool.query(
        'DELETE FROM books WHERE id = ? AND user_id = ?',
        [ bookId, user_id ]
    );

    if(result.affectedRows) {
        return res.status(201).json({
            status: true,
            message: 'Book deleted successfully'
        })
    } else {
        return res.status(404).json({
            status: false,
            message: 'Something went wrong while delete book',
        })
    }
})

exports.uploadBooksPhotos = catchAsync(async (req, res) => {
    const user_id = req?.user?.id || null
    const bookId = req.params.id

    if(!user_id) {
        res.status(404).json({
            status: true,
            message: 'User Not found'
        })
    }

    const outputDir = path.join(process.cwd(), `public/images/books/${bookId}`);
    const files = req.files
    if(files.length) {
        for (const file of files) {
            resizeImages(file, outputDir);

            // Update query for each file
            await pool.query(
                'INSERT INTO book_files (book_id, name) VALUES (?, ?)',
                [bookId, file.filename]
            );
        }
    }

    return res.status(201).json({
        status: true,
        message: 'Photos are uploaded successfully'
    })
})