require('dotenv').config();
const mysql = require('mysql2/promise');


// create mysql connection
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'jwtauth',
})

module.exports = pool;