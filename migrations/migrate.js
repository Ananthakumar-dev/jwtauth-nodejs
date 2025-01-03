const fs = require('fs')
const path = require('path')
const pool = require('../config/database');

const migrationFile = __filename;
async function runMigrations() {
    const migrationFiles = fs.readdirSync(__dirname);

    for(const file of migrationFiles) {
        if(migrationFile.endsWith(file)) continue; // skip the current file

        const migration = require(`./${file}`)
        await migration(pool)

        console.log('migration succeeded')
    }

    process.exit();
}

runMigrations();