const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./database');
const auth = require('./auth');
const rateLimit = require('express-rate-limit');
const { query, validationResult } = require("express-validator"); 


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const allowedDomains = ['https://api.spoonacular.com'];


// so this function only allowed for every 15 minutes only allows 10 requests
//error status code: 429
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 100, 
    message: "Too many requests from this IP, please try again later."
});

app.use(cors());
app.use(limiter);
app.use(express.json());



// Add rate limiter for forgot password so you can't spam our backend
// TODO (potentially) : add this rate lmiter for all our endpoints?
const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // this equals 1 hour
    max: 5, // limit each IP to 5 requests per windowMs (1 hour)
    message: { error: 'Too many password reset attempts. Please try again in an hour.' }
});

app.get('/', (req, res) => {
    res.send('Backend running on http://localhost:8000');
});

// Register a new user endpoint
// Registers a new user to the database (no way!!)
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Username, password, and email are required' });
    }

    try {
        const newUser = await auth.registerUser(username, password, email);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login user endpoint
// Logs the user in (no way)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await auth.loginUser(email, password);
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

// Mealplan Endpoint
// Generates a mealplan based on a users TDEE (targetCalories)
app.get(    
  '/mealplan',
  [
    // Validate 
    query('targetCalories').custom((value) => {
  const num = Number(value);
  if (isNaN(num) || num < 1 || num > 10000) {     // pre validation not using req or res to check using middleware recommand for login
    throw new Error('Invalid targetCalories value. Please provide a number between 1 and 10000.');
  }
  return true;
}),
    //  sanitize targetDiet and targetAllergen
    query('targetDiet').optional().trim().escape(),
    
    query('targetAllergen').optional().trim().escape()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    // Extract parameters
    const targetCalories = parseInt(req.query.targetCalories, 10);
   console.log(targetCalories);
    const targetDiet = req.query.targetDiet || "";
    //console.log(targetDiet);
    const targetAllergen = req.query.targetAllergen || "";
    console.log(targetAllergen);


    

    const apiUrl = 'https://api.spoonacular.com/mealplanner/generate';
    const apiOrigin = new URL(apiUrl).origin;

    if (!allowedDomains.includes(apiOrigin)) {
        return res.status(400).json({ error: 'Invalid API endpoint' });
    }

    

    try {
      const response = await axios.get(apiUrl, {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          targetCalories: targetCalories,
          diet: targetDiet,
          exclude: targetAllergen,
          timeFrame: 'week'
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching meal plan:', error.message);
      res.status(500).json({ error: 'Error fetching meal plan.' });
    }
  }
);

app.get(    
  '/daymealplan',
  [
    // Validate 
    query('targetCalories').custom((value) => {
  const num = Number(value);
  if (isNaN(num) || num < 1 || num > 10000) {     // pre validation not using req or res to check using middleware recommand for login
    throw new Error('Invalid targetCalories value. Please provide a number between 1 and 10000.');
  }
  return true;
}),
    //  sanitize targetDiet and targetAllergen
    query('targetDiet').optional().trim().escape(),
    
    query('targetAllergen').optional().trim().escape()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    // Extract parameters
    const targetCalories = parseInt(req.query.targetCalories, 10);
   console.log(targetCalories);
    const targetDiet = req.query.targetDiet || "";
    //console.log(targetDiet);
    const targetAllergen = req.query.targetAllergen || "";
    console.log(targetAllergen);


    

    const apiUrl = 'https://api.spoonacular.com/mealplanner/generate';
    const apiOrigin = new URL(apiUrl).origin;

    if (!allowedDomains.includes(apiOrigin)) {
        return res.status(400).json({ error: 'Invalid API endpoint' });
    }

    

    try {
      const response = await axios.get(apiUrl, {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          targetCalories: targetCalories,
          diet: targetDiet,
          exclude: targetAllergen,
          timeFrame: 'day'
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching meal plan:', error.message);
      res.status(500).json({ error: 'Error fetching meal plan.' });
    }
  }
);

// Forgot Password Endpoint
app.post('/forgotpassword', forgotPasswordLimiter, async (req, res) => {
    const { username, email, currentPassword, newPassword} = req.body;

    // Validate input
    if (!username || !email || !currentPassword || !newPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await auth.forgetPassword(username, email, currentPassword, newPassword);
        res.status(200).json({ message: result.message });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Export app for testing
module.exports = app;

// Start server only when not in testing mode
if (require.main === module) {
    // Test the database connection before starting the server
    db.testConnection().then(() => {
        app.listen(PORT, () => {
            console.log(`Backend running on http://localhost:${PORT}`);
        });
    });
}
