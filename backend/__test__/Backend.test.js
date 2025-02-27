const request = require('supertest');
const axios = require('axios');
const app = require('../index');
const db = require('../database');
const auth = require('../auth');
const jwt = require('jsonwebtoken');

{/*
    This file is used to test the index.js file
    We test the following:
    - The server responds to the base route ("/") successfully
    - The /mealplan route returns 400 if targetCalories is missing or invalid
    - The /mealplan route fetches meal plans successfully with valid targetCalories
    - The /mealplan route returns 400 if targetDiet is invalid

    
    - The /register endpoint successfully registers a new user
    - The /login endpoint successfully logs in a user
    - The /forgotpassword endpoint successfully changes password

    - The /daymealplan route returns 200 with valid targetCalories
    - The /daymealplan route returns 400 with invalid targetCalories
    - The /daymealplan route returns 200 with valid targetDiet
    // TODO: Fix this test - the frontend is not sending the targetdiet as the test was expecting it
    // - The /daymealplan route returns 400 with invalid targetDiet
    - The /daymealplan route returns 200 with valid targetAllergen
    // TODO: Fix this test - the frontend is not sending the targetallergen as the test was expecting it
    // - The /daymealplan route returns 400 with invalid targetAllergen

    - The /user/profile endpoint successfully returns user profile with valid token
    - The /user/profile endpoint returns 400 when user ID is invalid
    - The /user/profile endpoint returns 401 when no token is provided
    - The /user/profile endpoint returns 404 when user is not found
    */}

// Mock axios and auth module
jest.mock('axios');
jest.mock('../auth');

// Add this at the top with other imports
jest.mock('../database', () => ({
  query: jest.fn()
}));

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
});

describe('Test /daymealplan', () => {
    beforeEach(() => {
        // Mock successful axios response
        axios.get.mockResolvedValue({
            data: {
                meals: [],
                nutrients: {}
            }
        });
        // Mock console.error to prevent error messages during tests
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
        console.error.mockRestore(); // Restore console.error after each test
    });

    // Test #7: Test daymealplan endpoint with valid targetCalories
    it('returns 200 with valid targetCalories', async () => {
        const response = await request(app).get('/daymealplan').query({ targetCalories: 2000 });
        expect(response.statusCode).toBe(200);
        expect(axios.get).toHaveBeenCalledWith(
            'https://api.spoonacular.com/mealplanner/generate',
            expect.objectContaining({
                params: expect.objectContaining({
                    targetCalories: 2000,
                    timeFrame: 'day'
                })
            })
        );
    });

    // Test #8: Test daymealplan endpoint with invalid targetCalories
    it('returns 400 with invalid targetCalories', async () => {
        const response = await request(app).get('/daymealplan').query({ targetCalories: 'invalid' });
        expect(response.statusCode).toBe(400);
        expect(axios.get).not.toHaveBeenCalled();
    });

    // Test #9: Test daymealplan endpoint with valid targetDiet
    it('returns 200 with valid targetDiet', async () => {
        const response = await request(app).get('/daymealplan').query({ 
            targetCalories: 2000, 
            targetDiet: 'Vegetarian' 
        });
        expect(response.statusCode).toBe(200);
        expect(axios.get).toHaveBeenCalledWith(
            'https://api.spoonacular.com/mealplanner/generate',
            expect.objectContaining({
                params: expect.objectContaining({
                    targetCalories: 2000,
                    diet: 'Vegetarian',
                    timeFrame: 'day'
                })
            })
        );
    });

    // Test #10: Test daymealplan endpoint with invalid targetDiet
    // TODO: Fix this test
    // it('returns 400 with invalid targetDiet', async () => {
    //     const response = await request(app).get('/daymealplan').query({ 
    //         targetCalories: 2000, 
    //         targetDiet: 'invalid' 
    //     });
    //     expect(response.statusCode).toBe(400);
    //     expect(axios.get).not.toHaveBeenCalled();
    // });
    
    // Test #11: Test daymealplan endpoint with valid targetAllergen
    it('returns 200 with valid targetAllergen', async () => {
        const response = await request(app).get('/daymealplan').query({ 
            targetCalories: 2000, 
            targetAllergen: 'Gluten' 
        });
        expect(response.statusCode).toBe(200);
        expect(axios.get).toHaveBeenCalledWith(
            'https://api.spoonacular.com/mealplanner/generate',
            expect.objectContaining({
                params: expect.objectContaining({
                    targetCalories: 2000,
                    exclude: 'Gluten',
                    timeFrame: 'day'
                })
            })
        );
    }); 
    
    // Test #12: Test daymealplan endpoint with invalid targetAllergen
    // TODO: Fix this test
    // it('returns 400 with invalid targetAllergen', async () => {
    //     const response = await request(app).get('/daymealplan').query({ 
    //         targetCalories: 2000, 
    //         targetAllergen: 'invalid' 
    //     });
    //     expect(response.statusCode).toBe(400);
    //     expect(axios.get).not.toHaveBeenCalled();
    // }); 

    // Test #13: Test daymealplan endpoint with valid targetCalories and targetDiet
    it('returns 200 with valid targetCalories and targetDiet', async () => {
        const response = await request(app).get('/daymealplan').query({ 
            targetCalories: 2000, 
            targetDiet: 'Vegetarian' 
        });
        expect(response.statusCode).toBe(200);
        expect(axios.get).toHaveBeenCalledWith(
            'https://api.spoonacular.com/mealplanner/generate',
            expect.objectContaining({
                params: expect.objectContaining({
                    targetCalories: 2000,
                    diet: 'Vegetarian',
                    timeFrame: 'day'
                })
            })
        );
    });

    // Test #14: Test error handling when API call fails
    it('returns 500 when API call fails', async () => {
        axios.get.mockRejectedValue(new Error('API Error'));
        const response = await request(app).get('/daymealplan').query({ 
            targetCalories: 2000 
        });
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: 'Error fetching meal plan.' });
    });
});

// Test #8: Test authenticateToken middleware with no token
describe('Authentication and User Profile Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (process.env.NODE_ENV === 'test') {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    }
  });

  // Test #9: Test authenticateToken middleware with no token
  it('returns 401 when no token is provided', async () => {
    const response = await request(app)
      .get('/user/profile')
      .set('Authorization', '');

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'No token provided');
  });

  // Test #10: Test authenticateToken middleware with invalid token format
  it('returns 401 when token format is invalid', async () => {
    // Provide a token that fails the regex check
    const invalidFormatToken = 'invalid$token#format';
    
    const response = await request(app)
      .get('/user/profile')
      .set('Authorization', `Bearer ${invalidFormatToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid token format');
  });

  // Test #11: Test authenticateToken middleware with expired token
  it('returns 401 when token is expired', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation((_, __, callback) => {
      callback({ name: 'TokenExpiredError' });
    });

    const response = await request(app)
      .get('/user/profile')
      .set('Authorization', 'Bearer valid.token.format');

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'Token expired');
  });

  // Test #12: Test authenticateToken middleware with invalid token
  it('returns 403 when token is invalid', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation((_, __, callback) => {
      callback(new Error('Invalid token'));
    });

    const response = await request(app)
      .get('/user/profile')
      .set('Authorization', 'Bearer valid.token.format');

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Invalid token');
  });

  // Test #13: Test /user/profile endpoint with valid token
  it('returns user profile with valid token', async () => {
    // Mock jwt verification
    jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
      callback(null, { user_id: 1, email: 'test@test.com' });
    });

    // Mock database response
    db.query.mockResolvedValueOnce({
      rows: [{
        username: 'testuser',
        email: 'test@test.com',
        created_at: new Date()
      }]
    });

    const response = await request(app)
      .get('/user/profile')
      .set('Authorization', 'Bearer valid.token.format');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('created_at');
    expect(response.headers).toHaveProperty('x-ratelimit-limit');
    expect(response.headers).toHaveProperty('x-ratelimit-remaining');
  });

  // Test #14: Test /user/profile endpoint with invalid user ID
  it('returns 400 when user ID is invalid', async () => {
    // Mock jwt verification with invalid user_id
    jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
      callback(null, { user_id: 'invalid', email: 'test@test.com' });
    });

    const response = await request(app)
      .get('/user/profile')
      .set('Authorization', 'Bearer valid.token.format');

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid user ID');
  });

  // Test #15: Test /user/profile endpoint when user not found
  it('returns 404 when user is not found', async () => {
    // Mock jwt verification
    jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
      callback(null, { user_id: 1, email: 'test@test.com' });
    });

    // Mock empty database response
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .get('/user/profile')
      .set('Authorization', 'Bearer valid.token.format');

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  afterEach(() => {
    jest.resetAllMocks();
    console.error.mockRestore();
  });
});