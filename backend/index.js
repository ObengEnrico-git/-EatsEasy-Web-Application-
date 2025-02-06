const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./database');
const auth = require('./auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const allowedDomains = ['https://api.spoonacular.com'];

app.use(cors());
app.use(express.json());

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
app.get('/mealplan', async (req, res) => {
    const targetCalories = parseInt(req.query.targetCalories, 10);

    if (isNaN(targetCalories) || targetCalories < 0 || targetCalories > 10000) {
        return res.status(400).json({ error: 'Invalid targetCalories value. Please provide a number between 1 and 10000.' });
    }

    const apiUrl = 'https://api.spoonacular.com/mealplanner/generate';
    const apiOrigin = new URL(apiUrl).origin;

    if (!allowedDomains.includes(apiOrigin)) {
        return res.status(400).json({ error: 'Invalid API endpoint' });
    }

    try {
        const response = await axios.get(apiUrl, {
            params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                targetCalories,
                timeFrame: 'week',
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