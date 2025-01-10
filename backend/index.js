const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.get('/mealplan', async (req, res) => {
    const targetCalories = req.query.targetCalories;
    try {
        const response = await axios.get('https://api.spoonacular.com/mealplanner/generate', {
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