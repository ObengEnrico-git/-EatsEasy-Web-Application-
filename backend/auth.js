const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');
const dotenv = require('dotenv');


dotenv.config();

// For bcrypt password hashing -> this is more secure than SHA256
// There is a whole article on optimal number of salt rounds
// tbh i don't QUITE get this but i think 10 is an acceptable number (its in most articles / online forms)
// for more information on salt rounds heres a very good article:
// https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/
const SALT_ROUNDS = 10; 

// For JWT
// PLEASE make sure you generate a (your) JWT secret as the backend will not work if you don't generate a JWT secret.
// Q: How do I generate a JWT secret??
// A: You can do this by going to your console / terminal and typing this:
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
// once generated, please paste the output to JWT_SECRET in .env
const JWT_SECRET = process.env.JWT_SECRET;

// Function to register a new user
async function registerUser(username, password, email) {
    try {
        // hash the password (using the salt rounds const we made above)
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert the user into the database
        const query = `
            INSERT INTO users (username, password, email)
            VALUES ($1, $2, $3)
            RETURNING user_id, username, email;
        `;
        const values = [
            username.trim(),
            hashedPassword,
            email.toLowerCase().trim() 
        ];

        if (username.length > 50 || email.length > 255) {
            throw new Error('Input exceeds maximum length');
        }

        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        if (err.code === '23505') {
            throw new Error('Username or email already exists');
        }
        console.error('Error registering user:', err);
        throw err;
    }
}

// Function to log in a user
async function loginUser(email, password) {
    try {
        const sanitisedEmail = email.toLowerCase().trim();

        if (sanitisedEmail.length > 255) {
            throw new Error('Email exceeds maximum length');
        }

        const query = `
            SELECT user_id, email, password
            FROM users
            WHERE email = $1;
        `;
        const values = [sanitisedEmail];

        const result = await db.query(query, values);
        const user = result.rows[0];

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h'
        });

        return { user_id: user.user_id, email: user.email, token };
    } catch (err) {
        console.error('Error logging in user:', err);
        throw err;
    }  
}

async function forgetPassword(username, email, currentPassword, newPassword) {
    try {
        const sanitisedEmail = email.toLowerCase().trim();

        // Validate email length
        if (sanitisedEmail.length > 255) {
            throw new Error('Email exceeds maximum length');
        }

        // Fetch the user from the database
        const fetchQuery = `
            SELECT user_id, password
            FROM users
            WHERE username = $1 AND email = $2;
        `;
        const fetchValues = [username, sanitisedEmail];

        const fetchResult = await db.query(fetchQuery, fetchValues);
        const user = fetchResult.rows[0];

        if (!user) {
            throw new Error('User not found');
        }

        // Validate the current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // Update the user's password in the database
        const updateQuery = `
            UPDATE users
            SET password = $1
            WHERE user_id = $2;
        `;
        const updateValues = [hashedNewPassword, user.user_id];

        await db.query(updateQuery, updateValues);

        return { message: 'Password updated successfully' };
    } catch (err) {
        console.error('Error resetting password:', err);
        throw err;
    }
}

module.exports = {
    registerUser,
    loginUser,
    forgetPassword,
};