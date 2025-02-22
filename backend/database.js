const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

// Database configuration
// Please ensure your .ENV is up to date (aka, it includes all the new .env variables below)
// if it is not up to date, the db connection will not work
const pool = new Pool({
    user: process.env.USER_ID_DB,
    host: process.env.HOST_DB,
    database: process.env.DATABASE_DB,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB, 
});

// This tests the database connection and then prints to console the status
const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        if (!res.rows || res.rows.length === 0) {
            console.error('Unexpected database response:', res);
            return false;
        }
        console.log('Database connected successfully:', res.rows[0]);
        return true;
    } catch (err) {
        console.error('Error connecting to the database:', err);
        return false;
    }
};


// Add a function to close the pool
const closePool = async () => {
    await pool.end();
};

// this exports a query function that the other files can use (aka, auth.js)
module.exports = {
    query: (text, params) => pool.query(text, params),
    testConnection,
    closePool
};