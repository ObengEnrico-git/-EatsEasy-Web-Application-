const request = require('supertest');
const axios = require('axios');
const app = require('../index');
const db = require('../database');
const auth = require('../auth');

// Mock axios and auth module
jest.mock('axios');
jest.mock('../auth');

describe('Test Meal Plan API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Only mock console.error in CI/test environment
        if (process.env.NODE_ENV === 'test') {
            jest.spyOn(console, 'error').mockImplementation(() => {});
        }
    });

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

    // Test #4: Test register endpoint
    it('successfully registers a new user', async () => {
        const mockUser = {
            username: 'testuser',
            password: 'password123',
            email: 'test@test.com'
        };

        // Mock successful registration
        auth.registerUser.mockResolvedValueOnce({
            user_id: 1,
            username: mockUser.username,
            email: mockUser.email
        });

        const response = await request(app)
            .post('/register')
            .send(mockUser);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'User registered successfully');
        expect(response.body).toHaveProperty('user');
    });

    // Test #5: Test login endpoint
    it('successfully logs in a user', async () => {
        const mockCredentials = {
            email: 'test@test.com',
            password: 'password123'
        };

        // Mock successful login
        auth.loginUser.mockResolvedValueOnce({
            user_id: 1,
            email: mockCredentials.email,
            token: 'mock-jwt-token'
        });

        const response = await request(app)
            .post('/login')
            .send(mockCredentials);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Login successful');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('token');
    });

    // Test #6: Test forgot password endpoint
    it('successfully changes password', async () => {
        const mockData = {
            username: 'testuser',
            email: 'test@test.com',
            currentPassword: 'oldpassword',
            newPassword: 'newpassword123'
        };

        // Mock successful password change
        auth.forgetPassword.mockResolvedValueOnce({
            message: 'Password updated successfully'
        });

        const response = await request(app)
            .post('/forgotpassword')
            .send(mockData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Password updated successfully');
    });

    // Clean up mocks after each test
    afterEach(() => {
        jest.resetAllMocks();
        console.error.mockRestore();
    });

    // Close the database connection
    afterAll(async () => {
        await db.closePool();
    });
});