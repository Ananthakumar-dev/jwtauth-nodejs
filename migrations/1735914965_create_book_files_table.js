const bookFilesTable = async (pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS book_files (
            id INT AUTO_INCREMENT PRIMARY KEY,
            book_id INT,
            name VARCHAR(255),
            FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
        )
    `)
}

module.exports = bookFilesTable