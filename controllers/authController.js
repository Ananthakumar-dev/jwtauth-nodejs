const pool = require('../config/database')
const catchAsync = require('../utils/catchAsync')
const { encrypt, decrypt } = require('../utils/bcrypt')
const { sign } = require('../utils/jwt')

exports.register = catchAsync(async (req, res) => {
    const { username, email, password } = req.body;

    const [ result ] = await pool.query(
        'INSERT INTO users (username, email, password) VALUES(?, ?, ?)',
        [ username, email, encrypt(password) ]
    );


    if(result.insertId) {
        const [ user ] = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [ result.insertId ]
        )

        const jwtData = { id: user.at(0).id, role: user.at(0).role }
        const token = await sign(jwtData)

        res.status(201).json({
            status: true,
            data: {
                id: result.insertId,
                token
            }
        })
    } else {
        res.status(500).json({
            status: false,
            message: 'Something went wrong while insert user'
        })
    }

})

exports.login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const [ queryResult ] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [ email ]
    );

    const user = queryResult.at(0) || null;
    if(!user) {
        return res.status(401).json({
            status: false,
            message: 'User not found',
        })
    }

    const pwdCompare = decrypt(password, user.password)
    if(!pwdCompare) {
        return res.status(401).json({
            status: false,
            message: 'User not found'
        })
    }

    const jwtData = { id: user.id, role: user.role }
    const token = await sign(jwtData)

    res.status(200).json({
        status: true,
        message: 'LoggedIn Successfully',
        data: {
            token
        }
    })
})