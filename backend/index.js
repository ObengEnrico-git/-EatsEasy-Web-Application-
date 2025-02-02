const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const allowedDomains = ['https://api.spoonacular.com'];

app.use(cors());

app.get('/', (req, res) => {
    res.send('Backend running on http://localhost:8000');
});

app.get('/mealplan', async (req, res) => {
    const targetCalories = parseInt(req.query.targetCalories, 10);

    // Even though we check targetCalories (TDEE) within the frontend
    // We need to still validate it within the backend (security risks)
    if (isNaN(targetCalories) || targetCalories < 0 || targetCalories > 10000) {
        return res.status(400).json({ error: 'Invalid targetCalories value. Please provide a number between 1 and 10000.' });
    }

    const apiUrl = 'https://api.spoonacular.com/mealplanner/generate';

    // Ensures only spoonacular is allowed and no other API endpoint
    if (!allowedDomains.includes(new URL(apiUrl).origin)) {
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