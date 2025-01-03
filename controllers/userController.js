const pool = require('../config/database')
const catchAsync = require('../utils/catchAsync')

exports.getUsers = catchAsync(async (req, res) => {
    const [ result ] = await pool.query(
        'SELECT * FROM users'
    );

    res.status(200).json({
        status: true,
        data: {
            users: result
        },
    })
})