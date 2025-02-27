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

// Save multiple recipes for a user
router.post('/save-all', authenticateToken, async (req, res) => {
    try {
        const { recipes, weekData } = req.body;
        const userId = req.user.user_id;

        if (!Array.isArray(recipes) || recipes.length === 0) {
            return res.status(400).json({ error: 'No recipes provided' });
        }

        // First ensure all recipes exist in the recipes table
        for (const recipe of recipes) {
            const checkQuery = `
                SELECT recipe_id FROM recipes 
                WHERE recipe_url = $1;
            `;
            const existingRecipe = await db.query(checkQuery, [recipe.sourceUrl]);

            if (existingRecipe.rows.length === 0) {
                // Insert the recipe if it doesn't exist
                const insertRecipeQuery = `
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

                await db.query(insertRecipeQuery, [
                    recipe.title,
                    recipe.imageUrl,
                    recipe.readyInMinutes,
                    recipe.servings,
                    recipe.sourceUrl
                ]);
            }
        }

        // Create a saved_meal_plans entry
        const createPlanQuery = `
            INSERT INTO saved_meal_plans (user_id, created_at)
            VALUES ($1, CURRENT_TIMESTAMP)
            RETURNING plan_id;
        `;
        const planResult = await db.query(createPlanQuery, [userId]);
        const planId = planResult.rows[0].plan_id;

        // Now save all recipes to saved_recipes with day and order information
        const savedRecipes = [];
        for (const recipe of recipes) {
            // Get recipe_id
            const recipeQuery = `
                SELECT recipe_id FROM recipes 
                WHERE recipe_url = $1;
            `;
            const recipeResult = await db.query(recipeQuery, [recipe.sourceUrl]);
            const recipeId = recipeResult.rows[0].recipe_id;

            // Save the recipe with day and order information
            const saveQuery = `
                INSERT INTO saved_recipes (
                    user_id, 
                    recipe_id, 
                    plan_id,
                    day_of_week,
                    meal_order
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING saved_recipe_id;
            `;
            const savedResult = await db.query(saveQuery, [
                userId,
                recipeId,
                planId,
                recipe.day,
                recipe.mealOrder
            ]);
            
            savedRecipes.push({
                saved_recipe_id: savedResult.rows[0].saved_recipe_id,
                recipe_id: recipeId,
                title: recipe.title,
                day: recipe.day,
                mealOrder: recipe.mealOrder
            });
        }

        res.status(201).json({
            message: 'Recipes saved successfully',
            planId,
            savedRecipes
        });
    } catch (error) {
        console.error('Error saving recipes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get saved recipes for a user
router.get('/saved', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;

        const query = `
            SELECT 
                r.*,
                sr.saved_at,
                sr.day_of_week,
                sr.meal_order,
                smp.plan_id,
                smp.created_at as plan_created_at
            FROM recipes r
            JOIN saved_recipes sr ON r.recipe_id = sr.recipe_id
            JOIN saved_meal_plans smp ON sr.plan_id = smp.plan_id
            WHERE sr.user_id = $1
            ORDER BY smp.created_at DESC, sr.day_of_week, sr.meal_order;
        `;

        const result = await db.query(query, [userId]);
        
        // Group recipes by plan_id
        const plans = result.rows.reduce((acc, recipe) => {
            if (!acc[recipe.plan_id]) {
                acc[recipe.plan_id] = {
                    planId: recipe.plan_id,
                    createdAt: recipe.plan_created_at,
                    recipes: {}
                };
            }
            
            const day = recipe.day_of_week;
            if (!acc[recipe.plan_id].recipes[day]) {
                acc[recipe.plan_id].recipes[day] = [];
            }
            
            acc[recipe.plan_id].recipes[day].push({
                ...recipe,
                mealOrder: recipe.meal_order
            });
            
            return acc;
        }, {});

        res.json(Object.values(plans));
    } catch (error) {
        console.error('Error fetching saved recipes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a meal plan
router.delete('/meal-plan/:planId', authenticateToken, async (req, res) => {
    try {
        const { planId } = req.params;
        const userId = req.user.user_id;

        console.log('Delete request received for planId:', planId); // Debug log
        console.log('User ID:', userId); // Debug log

        // First verify that the meal plan belongs to the user
        const verifyQuery = `
            SELECT plan_id FROM saved_meal_plans
            WHERE plan_id = $1 AND user_id = $2;
        `;
        const verifyResult = await db.query(verifyQuery, [planId, userId]);
        console.log('Verify result:', verifyResult.rows); // Debug log

        if (verifyResult.rows.length === 0) {
            return res.status(404).json({ error: 'Meal plan not found or unauthorized' });
        }

        // Delete saved_recipes first (due to foreign key constraint)
        const deleteRecipesQuery = `
            DELETE FROM saved_recipes
            WHERE plan_id = $1
            RETURNING *;
        `;
        const deletedRecipes = await db.query(deleteRecipesQuery, [planId]);
        console.log('Deleted recipes count:', deletedRecipes.rowCount); // Debug log

        // Then delete the meal plan
        const deletePlanQuery = `
            DELETE FROM saved_meal_plans
            WHERE plan_id = $1 AND user_id = $2
            RETURNING *;
        `;
        const deletedPlan = await db.query(deletePlanQuery, [planId, userId]);
        console.log('Deleted plan:', deletedPlan.rows[0]); // Debug log

        res.json({ 
            message: 'Meal plan deleted successfully',
            deletedPlanId: planId,
            deletedRecipesCount: deletedRecipes.rowCount
        });
    } catch (error) {
        console.error('Error deleting meal plan:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message
        });
    }
});

module.exports = router;