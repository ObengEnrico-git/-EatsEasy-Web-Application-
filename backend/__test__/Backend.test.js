const request = require('supertest');
const axios = require('axios');
const app = require('../index');
const db = require('../database');

// Mock axios
jest.mock('axios');

describe('Test Meal Plan API', () => {

    // Test #1: Ensure the server responds to the `/` route correctly
    it('responds to the base route ("/") successfully', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Backend running on http://localhost:8000');
    });

    // Test #2: Validate the `/mealplan` route for missing or invalid query parameters
    it('returns 400 if targetCalories is missing or invalid', async () => {
        const response = await request(app).get('/mealplan');
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid targetCalories value. Please provide a number between 1 and 10000.');
    });

    // Test #3: Validate the `/mealplan` route with proper query parameters
    it('fetches meal plans successfully with valid targetCalories', async () => {
        // Mock the API response
        const mockResponse = {
            data: {
                week: {
                    monday: {
                        meals: [
                            {
                                id: 123,
                                title: "Test Meal"
                            }
                        ]
                    }
                }
            }
        };
        
        axios.get.mockResolvedValueOnce(mockResponse);

        const response = await request(app)
            .get('/mealplan')
            .query({ targetCalories: 2000 });
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('week');
        expect(response.body.week).toHaveProperty('monday');
        expect(response.body.week.monday).toHaveProperty('meals');
        expect(response.body.week.monday.meals[0]).toHaveProperty('id');
        expect(response.body.week.monday.meals[0]).toHaveProperty('title');
    });

    //TODO: Add database connection test check

    // Clean up mocks after each test
    afterEach(() => {
        jest.resetAllMocks();
    });

    // Close the database connection
    afterAll(async () => {
        await db.closePool();
    });
});