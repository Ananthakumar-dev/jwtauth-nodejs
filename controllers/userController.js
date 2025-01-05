const pool = require('../config/database')
const catchAsync = require('../utils/catchAsync')
const { encrypt } = require('../utils/bcrypt')

exports.getUserDetails = catchAsync(async (req, res) => {
    const user_id = req?.user?.id || null;

    if(!user_id) {
        return res.status(404).json({
            status: false,
            message: 'User id not found'
        });
    }

    const [ result ] = await pool.query(
        'SELECT username, email, role FROM users WHERE id = ?',
        [ user_id ]
    );

    res.status(200).json({
        status: true,
        data: {
            user: result.at(0)
        },
    })
})

exports.updateUser = catchAsync(async (req, res) => {
    const user_id = req?.user?.id || null;

    if(!user_id) {
        return res.status(404).json({
            status: false,
            message: 'User id not found'
        });
    }

    const { username, email, password } = req.body;
    const updates = [];
    const params = [];

    if(username) {
        updates.push('username = ?')
        params.push(username)
    }

    if(email) {
        updates.push('email = ?')
        params.push(email)
    }

    if(password) {
        updates.push('password = ?')
        params.push(
            encrypt(password)
        )
    }

    params.push(user_id) // push user id to params

    const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    const [ result ] = await pool.query(updateQuery, params)

    if(result.affectedRows) {
        res.status(201).json({
            status: true,
            message: 'User updated successfully'
        })
    } else {
        res.status(404).json({
            status: false,
            message: 'Something went wrong while update user',
        })
    }
})

exports.deleteUser = catchAsync(async (req, res) => {
    const user_id = req?.user?.id || null;

    if(!user_id) {
        return res.status(404).json({
            status: false,
            message: 'User id not found'
        });
    }

    const [ result ] = await pool.query(
        'DELETE FROM users WHERE id = ?',
        [ user_id ]
    )

    if(result.affectedRows) {
        return res.status(201).json({
            status: true,
            message: 'User deleted successfully'
        })
    } else {
        return res.status(404).json({
            status: false,
            message: 'Something went wrong while delete user',
        })
    }
})