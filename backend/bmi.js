const express = require('express');
const axios = require('axios');
const db = require('./database');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const router = express.Router();

// Authentication middleware
// For authentication, we need to check if the user is authenticated
// If the user is authenticated, we will store the recipe in the database
// If the user is not authenticated, we will return the recipe from the Spoonacular API

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No authentication token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired' });
            }
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.user = {
            user_id: user.user_id,
            email: user.email
        };
        next();
    });
};

// Save BMI data
router.post('/saveBmi', authenticateToken, async (req, res) => {
    try {
        const { 
            gender, 
            age, 
            weight, 
            weight_unit, 
            height, 
            height_unit, 
            activity_level,
            diet_preferences,
            intolerances,
            bmi_status,
            bmi
        } = req.body;

        // Validate gender
        if (!['Male', 'Female'].includes(gender)) {
            return res.status(400).json({ error: 'Invalid gender value' });
        }

        // Validate numeric values
        if (isNaN(parseFloat(bmi)) || isNaN(parseFloat(age)) || 
            isNaN(parseFloat(weight)) || isNaN(parseFloat(height))) {
            return res.status(400).json({ error: 'Invalid numeric values' });
        }

        // Ensure arrays are properly formatted
        const formattedDietPreferences = Array.isArray(diet_preferences) ? diet_preferences : [];
        const formattedIntolerances = Array.isArray(intolerances) ? intolerances : [];

        const query = `
            INSERT INTO bmi_values (
                user_id, 
                gender, 
                age, 
                weight, 
                weight_unit, 
                height, 
                height_unit, 
                activity_level,
                diet_preferences,
                intolerances,
                bmi_status,
                bmi,
                created_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
            RETURNING *
        `;

        const values = [
            req.user.user_id,
            gender,
            parseFloat(age),
            parseFloat(weight),
            weight_unit,
            parseFloat(height),
            height_unit,
            activity_level,
            formattedDietPreferences,
            formattedIntolerances,
            bmi_status,
            parseFloat(bmi)
        ];

        const result = await db.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error saving BMI:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.detail || 'No additional details available'
        });
    }
});

// Get BMI history for a user
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const query = `
            SELECT 
                bmi_id,
                gender,
                age,
                weight,
                weight_unit,
                height,
                height_unit,
                activity_level,
                diet_preferences,
                intolerances,
                created_at,
                bmi_status,
                bmi
            FROM bmi_values 
            WHERE user_id = $1 
            ORDER BY created_at DESC
        `;

        const result = await db.query(query, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching BMI history:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get latest BMI data for a user
router.get('/latest', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const query = `
            SELECT 
                bmi_id,
                gender,
                age,
                weight,
                weight_unit,
                height,
                height_unit,
                activity_level,
                diet_preferences,
                intolerances,
                created_at,
                bmi_status,
                bmi
            FROM bmi_values 
            WHERE user_id = $1 
            ORDER BY created_at DESC 
            LIMIT 1
        `;

        const result = await db.query(query, [userId]);
        res.status(200).json(result.rows[0] || null);
    } catch (error) {
        console.error('Error fetching latest BMI:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;