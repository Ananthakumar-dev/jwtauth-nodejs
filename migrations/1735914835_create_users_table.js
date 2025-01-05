const userTable = async(pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(30) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('author', 'admin') DEFAULT 'author',
            photo VARCHAR(255) DEFAULT 'default_profile.png',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        );
    `);
}

module.exports = userTable;