const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require('./database');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const router = express.Router();
const API_KEY = process.env.GEN_AI; 

// Initialise the Google Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Authentication middleware - reused from other routes
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

// Helper function to call Gemini API
async function generateContent(prompt) {
    try {
        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Generate content
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Parse the JSON response
        try {
            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error parsing Gemini response as JSON:', error);
            // If parsing fails, try to extract JSON from the text using regex
            const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                              responseText.match(/```\n([\s\S]*?)\n```/) ||
                              responseText.match(/{[\s\S]*}/);
                              
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1] || jsonMatch[0]);
            }
            
            // If all parsing attempts fail, create a basic fallback structure
            return {
                insights: [
                    {
                        title: "AI Analysis",
                        description: responseText.substring(0, 200) + "..."
                    }
                ]
            };
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new Error(`Gemini API error: ${error.message}`);
    }
}

// Get personalised AI insights based on user's BMI, favourites, and dietary preferences
router.get('/personal-insights', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        // 1. Get user's latest BMI data
        const bmiQuery = `
            SELECT 
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
            FROM bmi_values 
            WHERE user_id = $1 
            ORDER BY created_at DESC 
            LIMIT 1
        `;
        const bmiResult = await db.query(bmiQuery, [userId]);
        const bmiData = bmiResult.rows[0] || null;
        
        // 2. Get user's favourite recipes from saved meal plans
        const favouritesQuery = `
            SELECT r.title, r.recipe_url
            FROM saved_recipes sr
            JOIN recipes r ON sr.recipe_id = r.recipe_id
            WHERE sr.user_id = $1
            ORDER BY sr.saved_at DESC
            LIMIT 5
        `;
        const favouritesResult = await db.query(favouritesQuery, [userId]);
        const favouriteRecipes = favouritesResult.rows || [];
        
        // 3. Get user's individually favourited recipes
        const individualFavouritesQuery = `
            SELECT r.title, r.recipe_url, fir.meal_order
            FROM favourite_individual_recipes fir
            JOIN recipes r ON fir.recipe_id = r.recipe_id
            WHERE fir.user_id = $1
            ORDER BY fir.saved_at DESC
            LIMIT 10
        `;
        const individualFavouritesResult = await db.query(individualFavouritesQuery, [userId]);
        const individualFavourites = individualFavouritesResult.rows || [];
        
        // Group individual favourites by meal type
        const mealTypePreferences = {};
        individualFavourites.forEach(recipe => {
            const mealType = recipe.meal_order || 'Not specified';
            if (!mealTypePreferences[mealType]) {
                mealTypePreferences[mealType] = [];
            }
            mealTypePreferences[mealType].push(recipe.title);
        });
        
        // 4. Generate AI insights using Gemini
        const prompt = `Analyse this user's profile and provide 3-5 personalised insights about their diet, nutrition needs, and recipe recommendations. Please respond in British English.
                    
        User data:
        - BMI: ${bmiData?.bmi || 'Not provided'} (${bmiData?.bmi_status || 'Unknown'})
        - Gender: ${bmiData?.gender || 'Not provided'}
        - Age: ${bmiData?.age || 'Not provided'}
        - Weight: ${bmiData?.weight || 'Not provided'} ${bmiData?.weight_unit || ''}
        - Height: ${bmiData?.height || 'Not provided'} ${bmiData?.height_unit || ''}
        - Activity level: ${bmiData?.activity_level || 'Not provided'}
        - Diet preferences: ${JSON.stringify(bmiData?.diet_preferences) || 'None'}
        - Intolerances: ${JSON.stringify(bmiData?.intolerances) || 'None'}
        
        Favourite recipes from meal plans: ${favouriteRecipes.map(r => r.title).join(', ') || 'None'}
        
        Individual favourited recipes by meal type:
        ${Object.entries(mealTypePreferences).map(([mealType, recipes]) => 
            `${mealType}: ${recipes.join(', ')}`
        ).join('\n') || 'None'}
        
        Format your response as a JSON object with an array of insights, each with a 'title' and 'description'. Keep descriptions concise and actionable. Use the following structure exactly:
        
        {
          "insights": [
            {
              "title": "Insight title",
              "description": "Insight description"
            },
            ...
          ]
        }
        
        Your insights should include:
        1. Analysis based on their BMI and dietary information
        2. Pattern analysis from their favourite recipes (both from meal plans and individual favourites)
        3. Meal-specific recommendations if they have favourited recipes for specific meal types
        4. Personalised nutrition guidance based on their health metrics
        
        Just provide the JSON object with no other text. Ensure it's valid JSON.`;
        
        const aiResponse = await generateContent(prompt);
        
        // 5. Store insights in database for future reference
        const storeInsightQuery = `
            INSERT INTO ai_insights (user_id, insights_data, created_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            RETURNING insight_id
        `;
        await db.query(storeInsightQuery, [userId, aiResponse]);
        
        res.status(200).json(aiResponse);
    } catch (error) {
        console.error('Error generating AI insights:', error);
        res.status(500).json({ 
            error: 'Failed to generate insights',
            details: error.message
        });
    }
});

// Get AI recipe analysis for a specific recipe
router.get('/recipe-analysis/:recipeId', authenticateToken, async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        
        // Get recipe details
        const recipeQuery = `
            SELECT * FROM recipes 
            WHERE recipe_id = $1
        `;
        const recipeResult = await db.query(recipeQuery, [recipeId]);
        
        if (recipeResult.rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        
        const recipe = recipeResult.rows[0];
        
        // Generate AI insights about the recipe using Gemini
        const prompt = `Analyse this recipe and provide nutritional insights, please respond in British English:
                    
        Recipe: ${recipe.title}
        Preparation time: ${recipe.prep_time} minutes
        Servings: ${recipe.servings}
        
        Provide a JSON response with: 
        1. Estimated calorie range
        2. Nutritional balance assessment
        3. Dietary classifications (gluten-free, vegetarian, etc.)
        4. A potential health benefit
        5. A potential modification to make it healthier
        
        Format your response as valid JSON. Keep all insights factual and concise.`;
        
        const aiResponse = await generateContent(prompt);
        
        res.status(200).json(aiResponse);
    } catch (error) {
        console.error('Error analyzing recipe:', error);
        res.status(500).json({ 
            error: 'Failed to analyze recipe',
            details: error.message
        });
    }
});

// Get recommendations for meal plan optimisation
router.get('/meal-plan-recommendations', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        // Get user's BMI data and most recent saved meal plan
        const bmiQuery = `
            SELECT 
                bmi_status,
                diet_preferences,
                intolerances,
                activity_level
            FROM bmi_values 
            WHERE user_id = $1 
            ORDER BY created_at DESC 
            LIMIT 1
        `;
        const bmiResult = await db.query(bmiQuery, [userId]);
        const bmiData = bmiResult.rows[0] || null;
        
        // Get latest meal plan
        const mealPlanQuery = `
            SELECT 
                plan_id,
                created_at
            FROM saved_meal_plans
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 1
        `;
        const mealPlanResult = await db.query(mealPlanQuery, [userId]);
        
        if (mealPlanResult.rows.length === 0) {
            return res.status(200).json({ 
                message: 'No meal plans found for optimization',
                recommendations: [] 
            });
        }
        
        const planId = mealPlanResult.rows[0].plan_id;
        
        // Get meal plan recipes
        const recipeQuery = `
            SELECT 
                r.recipe_id,
                r.title,
                sr.day,
                sr.meal_order
            FROM saved_recipes sr
            JOIN recipes r ON sr.recipe_id = r.recipe_id
            WHERE sr.plan_id = $1
            ORDER BY sr.day, sr.meal_order
        `;
        const recipeResult = await db.query(recipeQuery, [planId]);
        const mealPlanRecipes = recipeResult.rows || [];
        
        // Format meal plan data by day
        const mealPlanByDay = {};
        mealPlanRecipes.forEach(recipe => {
            if (!mealPlanByDay[recipe.day]) {
                mealPlanByDay[recipe.day] = [];
            }
            mealPlanByDay[recipe.day].push({
                title: recipe.title,
                mealOrder: recipe.meal_order
            });
        });
        
        // Generate AI recommendations using Gemini
        const mealPlanText = Object.keys(mealPlanByDay).map(day => 
            `${day}:\n${mealPlanByDay[day].map(meal => `- ${meal.title}`).join('\n')}`
        ).join('\n\n');
        
        const prompt = `Analyse this meal plan and provide optimisation recommendations based on the user's profile, please respond in British English:
                    
        User profile:
        - BMI status: ${bmiData?.bmi_status || 'Not provided'}
        - Diet preferences: ${JSON.stringify(bmiData?.diet_preferences) || 'None'}
        - Intolerances: ${JSON.stringify(bmiData?.intolerances) || 'None'}
        - Activity level: ${bmiData?.activity_level || 'Not provided'}
        
        Meal plan:
        ${mealPlanText}
        
        Provide a JSON response with:
        1. Overall assessment of nutritional balance
        2. 3-5 specific recommendations to improve the meal plan
        3. Suggestion for meal timing based on activity level
        
        Format your response as valid JSON. Keep the response concise and practical.`;
        
        const aiResponse = await generateContent(prompt);
        
        res.status(200).json(aiResponse);
    } catch (error) {
        console.error('Error generating meal plan recommendations:', error);
        res.status(500).json({ 
            error: 'Failed to generate meal plan recommendations',
            details: error.message
        });
    }
});

module.exports = router; 