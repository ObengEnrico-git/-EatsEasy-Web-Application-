const express = require('express');
const axios = require('axios');
const db = require('./database');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const API_KEY = process.env.SPOONACULAR_API_KEY;

// All routes in this file will be prefixed with /api/recipes
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

// POST route to store recipe in database and return recipe data - requires user to be authenticated
// This route is used to store recipes from the Spoonacular API
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Get the recipe data from the request body
        const { recipeId, title, imageUrl, readyInMinutes, servings, sourceUrl } = req.body;

        // Validate the required fields
        if (!title || !sourceUrl) {
            return res.status(400).json({ error: 'Title and source URL are required' });
        }

        // First check if recipe already exists
        const checkQuery = `
            SELECT recipe_id FROM recipes 
            WHERE recipe_url = $1;
        `;

        // Check if the recipe already exists in the database
        const existingRecipe = await db.query(checkQuery, [sourceUrl]);

        // If recipe doesn't exist, insert it
        if (existingRecipe.rows.length === 0) {
            const insertQuery = `
                INSERT INTO recipes (
                    title, 
                    photo_url, 
                    prep_time, 
                    servings, 
                    recipe_url
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING recipe_id;
            `;

            // Insert the recipe into the database
            const values = [
                title,
                imageUrl,
                readyInMinutes,
                servings,
                sourceUrl
            ];

            // Log the recipe data to be inserted
            // TODO: Remove this after testing (The Console.log is for testing purposes)
            console.log('Inserting new recipe:', { title, sourceUrl });

            // Insert the recipe into the database
            const result = await db.query(insertQuery, values);

            // Return the recipe ID and status
            res.status(201).json({
                message: 'Recipe stored successfully',
                recipeId: result.rows[0].recipe_id,
                status: 'created'
            });
        } else {
            // Recipe already exists - return 200 status with existing ID
            // TODO: Remove this after testing (The Console.log is for testing purposes)
            console.log('Found existing recipe:', { title, sourceUrl });
            res.status(200).json({
                message: `Recipe "${title}" already exists in database`,
                recipeId: existingRecipe.rows[0].recipe_id,
                status: 'existing'
            });
        }
    } catch (error) {
        // Log the error
        console.error('Error storing recipe:', error);
        if (error.code) {
            console.error('Database error code:', error.code);
        }
        if (error.detail) {
            console.error('Error detail:', error.detail);
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET route to get recipe by URL - no authentication required for viewing
router.get('/', async (req, res) => {
    try {
        // Get the recipe URL from the request query
        const { recipeUrl } = req.query;

        // Validate the required fields
        if (!recipeUrl) {
            return res.status(400).json({ error: 'Recipe URL is required' });
        }

        // Log the recipe URL to be fetched
        // TODO: Remove this after testing (The Console.log is for testing purposes)
        console.log('Fetching recipe for URL:', recipeUrl);

        // Query the database to get the recipe
        const query = `
            SELECT * FROM recipes 
            WHERE recipe_url = $1;
        `;

        // Query the database to get the recipe
        const result = await db.query(query, [recipeUrl]);

        // If the recipe is found in the database, return the recipe
        if (result.rows.length > 0) {
            // Log the recipe found in the database
            // TODO: Remove this after testing (The Console.log is for testing purposes)
            console.log('Found recipe in database:', result.rows[0]);

            // Return the recipe data
            res.json(result.rows[0]);
        } else {
            // If the recipe is not found in the database, fetch it from the Spoonacular API
            console.log('Recipe not found in database, fetching from Spoonacular');
            const spoonacularUrl = `https://api.spoonacular.com/recipes/extract?apiKey=${API_KEY}&url=${encodeURIComponent(recipeUrl)}`;
            
            // Fetch the recipe from the Spoonacular API
            const response = await axios.get(spoonacularUrl);

            // Return the recipe data
            res.json(response.data);
        }
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;