const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const { query, validationResult } = require("express-validator");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const allowedDomains = ['https://api.spoonacular.com'];


//  limits on the number of requests a client can send to backend for a period use-case: limit login attempts to prevent 
// brute-force attacks
// so this function only allowed for every 15 minutes only allows 100 requests
//error status code: 429
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 100, 
    message: "Too many requests from this IP, please try again later."
});


app.use(cors());

app.use(limiter);

app.get('/', (req, res) => {
    res.send('Backend running on http://localhost:8000');
});

app.get('/mealplan',[
    query('targetCalories').isNumeric().withMessage("Calories must be a number")
    .custom(value => {   
    if ( value < 0 || value > 10000) {
      throw new Error('Calories must be between 0 and 10000');
    }
    return true;
  }),
    query('targetDiet').optional().trim().escape(),
    query('targetAllergen').optional().trim().escape()
], async (req, res) => {

const errors = validationResult(req);
    
    // Even though we check targetCalories (TDEE) within the frontend
    // We need to still validate it within the backend (security risks)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return errors if validation fails
    }

    console.log("Query Params:", req.query);

    const targetCalories = parseInt(req.query.targetCalories, 10);// rounds 
   // console.log(targetCalories);
    const targetDiet = req.query.targetDiet;    
  //  console.log(targetDiet);
    const targetAllergen = req.query.targetAllergen;
  //  console.log(targetAllergen);

//debugging
   if (!process.env.SPOONACULAR_API_KEY) {
        console.error("API key is missing. Please check your .env file.");
        return res.status(500).json({ error: 'API key is missing.' });
    }
   
    const apiUrl = 'https://api.spoonacular.com/mealplanner/generate';

    // Ensures only spoonacular is allowed and no other API endpoint
    const apiOrigin = new URL(apiUrl).origin;
    if (!allowedDomains.includes(apiOrigin)) {
        return res.status(400).json({ error: 'Invalid API endpoint' });
    }  

    try {
        const response = await axios.get(apiUrl, {
            params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                targetCalories,               
                 diet: targetDiet || "", 
                 exclude: targetAllergen || ""
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch meal plans' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});