const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./database");
const auth = require("./auth");
const rateLimit = require("express-rate-limit");
const { query, validationResult } = require("express-validator");
const cookieParser = require('cookie-parser');
const recipesRouter = require('./recipes');
const bmiRouter = require('./bmi');
const aiInsightsRouter = require('./aiInsights');
const { getBrowser } = require("./globalBrowser"); // import new Puppeteer browser instance
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const allowedDomains = ["https://api.spoonacular.com"];
const allowedDiets = [
  "Gluten Free",
  "Ketogenic",
  "Vegetarian",
  "Lacto-Vegetarian",
  "Ovo-Vegetarian",
  "Vegan",
  "Pescetarian",
  "Paleo",
  "Primal",
  "Low FODMAP",
  "Whole30",
];

const allowedAllergens = [
  "Dairy",
  "Egg",
  "Gluten",
  "Grain",
  "Peanut",
  "Seafood",
  "Sesame",
  "Shellfish",
  "Soy",
  "Sulfite",
  "Tree Nut",
  "Wheat",
];

// so this function only allowed for every 15 minutes only allows 10 requests
//error status code: 429
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100000,
  message: "Too many requests from this IP, please try again later.",
});

app.set('trust proxy', 1);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['Set-Cookie', 'Cookie']
  }));

app.use(limiter);
app.use(express.json());
app.use(cookieParser());

// Add rate limiter for forgot password so you can't spam our backend
// TODO (potentially) : add this rate lmiter for all our endpoints?
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // this equals 1 hour
  max: 5, // limit each IP to 5 requests per windowMs (1 hour)
  message: {
    error: "Too many password reset attempts. Please try again in an hour.",
  },
});

// Middleware to authenticate the user
// This middleware is used to authenticate the user and check if they are logged in
// If they are not logged in, they will be redirected to the login page
// If they are logged in, they will be able to access the protected routes
// Parameters: req is the request object, res is the response object, next is the next middleware function

// Q: what is next?
// A: next is the next middleware function

// Q: what is a middleware function?
// A: a middleware function is a function that has access to the request object, the response object and the next middleware function

// Q: what is the request object?
// A: the request object is the object that contains the request data

const authenticateToken = (req, res, next) => {
  try {
    // Gets the token from the authorisation header
    const authHeader = req.headers["authorization"];

    // Gets the token from the authorisation header
    const token = authHeader && authHeader.split(" ")[1];

    // If the token is not provided, return a 401 error
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Adds token format validation
    // This is done to prevent any invalid tokens from being used
    // We do this because we want to ensure that the token is valid
    // This is done by checking if the token matches the regex
    // Why use regex?
    // A: regex is used to check if the token matches the format of a JWT token
    // What is a JWT token?
    // A: a JWT token is a token that is used to authenticate the user
    // What is a JWT token format?
    // A: a JWT token format is a format that is used to authenticate the user
    const tokenRegex =
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

    // If the token is not valid, return a 401 error
    if (!tokenRegex.test(token)) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Verifies the token
    // This is done to ensure that the token is valid
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      // If the token is expired, return a 401 error
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ error: "Token expired" });
        }

        // If the token is invalid, return a 403 error
        // This is done to prevent any invalid tokens from being used
        return res.status(403).json({ error: "Invalid token" });
      }

      // Don't expose sensitive user data
      // This is done to prevent any sensitive data from being exposed
      req.user = {
        user_id: user.user_id,
        email: user.email,
      };

      // Calls the next middleware
      // This is done to allow the user to access the protected routes
      next();
    });
  } catch (error) {
    // If there is an error, return a 500 error
    console.error("Authentication error:", error);

    // Sends the error back to the frontend
    return res.status(500).json({ error: "Authentication failed" });
  }
};



app.get("/", (req, res) => {
  res.send("Backend running on http://localhost:8000");
});

app.get("/checkAuth", authenticateToken,  (req, res) => {
  // If authentication is successful backend ping to check if token expired or not 
  res.status(200).json({ authenticated: true });
});

// Register a new user endpoint
// Registers a new user to the database (no way!!)
app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ error: "Username, password, and email are required" });
  }

  try {
    const newUser = await auth.registerUser(username, password, email);
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Login user endpoint
// Logs the user in (no way)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

    try {
        const user = await auth.loginUser(email, password);
        
        console.log('Setting Token Cookie:', user.token);

        // Send the user token cookie
        res.cookie('token', user.token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 60 * 60 * 1000,
            path: '/',
        });

        res.status(200).json({ 
          message: 'Login successful', 
          user: { 
              user_id: user.user_id, 
              email: user.email,
              token: user.token, // Include the token here
          } 
      });

    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

// Debug endpoint to check cookies
app.get('/debug-cookies', (req, res) => {
    console.log('Received cookies:', req.cookies);
    res.json({
      cookies: req.cookies,
      headers: req.headers
    });
  });

  // Logout endpoint
app.post('/logout', (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Mealplan Endpoint
// Generates a mealplan based on a users TDEE (targetCalories)
app.get(
  "/mealplan",
  [
    // Validate
    query("targetCalories").custom((value) => {
      const num = Number(value);
      if (isNaN(num) || num < 1 || num > 10000) {
        // pre validation not using req or res to check using middleware recommand for login
        throw new Error(
          "Invalid targetCalories value. Please provide a number between 1 and 10000."
        );
      }
      return true;
    }),
    //  sanitize targetDiet and targetAllergen
    query("targetDiet").optional().trim().escape(),

    query("targetAllergen").optional().trim().escape(),
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

    const apiUrl = "https://api.spoonacular.com/mealplanner/generate";
    const apiOrigin = new URL(apiUrl).origin;

    if (!allowedDomains.includes(apiOrigin)) {
      return res.status(400).json({ error: "Invalid API endpoint" });
    }

    try {
      const response = await axios.get(apiUrl, {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          targetCalories: targetCalories,
          diet: targetDiet,
          exclude: targetAllergen,
          timeFrame: "week",
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching meal plan:", error.message);
      res.status(500).json({ error: "Error fetching meal plan." });
    }
  }
);

app.get(
  "/daymealplan",
  [
    // Validate
    query("targetCalories").custom((value) => {
      const num = Number(value);
      if (isNaN(num) || num < 1 || num > 10000) {
        // pre validation not using req or res to check using middleware recommand for login
        throw new Error(
          "Invalid targetCalories value. Please provide a number between 1 and 10000."
        );
      }
      return true;
    }),
    //  sanitize targetDiet and targetAllergen
    query("targetDiet").optional().trim().escape(),

    query("targetAllergen").optional().trim().escape(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg,
      });
    }

    //TODO: Add a check to see if the targetDiet and targetAllergen are valid
    //TODO: Add a check to see if the targetCalories is a number
    //TODO: Add a check to see if the targetCalories is within the range of 1 to 10000

    // Extract parameters
    const targetCalories = parseInt(req.query.targetCalories, 10);
    const targetDiet = req.query.targetDiet || "";
    const targetAllergen = req.query.targetAllergen || "";

    const apiUrl = "https://api.spoonacular.com/mealplanner/generate";
    const apiOrigin = new URL(apiUrl).origin;

    if (!allowedDomains.includes(apiOrigin)) {
      return res.status(400).json({
        error: "Invalid API endpoint",
      });
    }

    try {
      const response = await axios.get(apiUrl, {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          targetCalories: targetCalories,
          diet: targetDiet,
          exclude: targetAllergen,
          timeFrame: "day",
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching meal plan:", error.message);
      res.status(500).json({
        error: "Error fetching meal plan.",
      });
    }
  }
);

// Forgot Password Endpoint
app.post("/forgotpassword", forgotPasswordLimiter, async (req, res) => {
  const { username, email, currentPassword, newPassword } = req.body;

  // Validate input
  if (!username || !email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await auth.forgetPassword(
      username,
      email,
      currentPassword,
      newPassword
    );
    res.status(200).json({ message: result.message });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// User profile endpoint
// This endpoint is used to get the user's profile information
// It is protected and can only be accessed by authenticated users
app.get("/user/profile", authenticateToken, async (req, res) => {
  try {
    // Sanitises the user_id from the token
    // This is done to prevent any SQL injection attacks
    // It also ensures that the user_id is a valid integer
    const userId = parseInt(req.user.user_id, 10);

    // If the user_id is not a valid integer, return a 400 error
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Queries the database for the user's profile information
    // This query selects the username, email and created_at from the users table where the user_id matches the sanitised user_id
    const query = `
      SELECT 
        username,
        email,
        created_at
      FROM users
      WHERE user_id = $1
    `;

    // Executes the query
    const result = await db.query(query, [userId]);

    // If the user is not found, return a 404 error
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove any sensitive data before sending
    const user = result.rows[0];
    delete user.password_hash;
    delete user.reset_token;

    // Add rate limiting headers
    // res.set("X-RateLimit-Limit", "100");
    // res.set("X-RateLimit-Remaining", "99");

    // Sends the user's profile information back to the frontend
    res.json(user);
  } catch (error) {
    // If there is an error, return a 500 error
    console.error("Error fetching user profile:", error);

    // Sends the error back to the frontend
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch user data endpoint
app.get('/api/user/data', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Query the database for the user's saved data
    const query = `
      SELECT 
        bmi_status,
        gender,
        age,
        height,
        height_unit,
        weight,
        weight_unit,
        diet_preferences,
        intolerances
      FROM users
      WHERE user_id = $1
    `;

    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User data not found' });
    }

    // Send the user's data back to the frontend
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/user/data', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {gender, age, height, height_unit, weight, weight_unit, dietPreferences, intolerances } = req.body;

    // Update the user's data in the database
    const query = `
      UPDATE users
      SET 
        gender = $1,
        age = $2,  
        height = $3,
        height_unit = $4,
        weight = $5,
        weight_unit = $6,
        diet_preferences = $7,
        intolerances = $8
      WHERE user_id = $9
    `;

    await db.query(query, [gender, age, height, height_unit, weight, weight_unit, dietPreferences, intolerances, userId]);

    res.status(200).json({ message: 'User data saved successfully' });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// In your backend (e.g., index.js)
app.get('/api/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.query('SELECT username FROM users WHERE user_id = $1', [decoded.user_id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ username: user.rows[0].username });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get("/fetchModifiedPage", async (req, res) => {
  const targetUrl = req.query.url;
  console.log(targetUrl);
  if (!targetUrl) {
    return res.status(400).send("No URL provided");
  }

  try {
    const browser = await getBrowser(); // opening brower is time comsuming so brower is alway open never close only page close
    const page = await browser.newPage();
    
    await page.goto(targetUrl, { timeout: 1000000, waitUntil: "networkidle2" });
    await page.screenshot({ path: "food.png", fullPage: true });

    // Remove the element with the desired selector (e.g., a banner with id "banner")
    await page.evaluate(() => {
      document.querySelector("#header")?.remove(); // Adjust this selector as needed to remove elements 
      document.querySelector("#MarketGidPreloadN4300")?.remove();
      document.querySelector(".adsbygoogle")?.remove();
      document.querySelector(".adsbygoogle adsbygoogle-noablate")?.remove();
      document.querySelector(".jar")?.remove();
      document.querySelector("#ad_position_box")?.remove();
      document.querySelector(".twitter")?.remove();
      document.querySelector(".pinterest")?.remove();
      document.querySelector(".panel-content fade")?.remove();
      document.querySelector(".print")?.remove();
      document.querySelector("#skip-link")?.remove();

      document.querySelector(".panel-pane.pane-custom.pane-4")?.remove();
      document
        .querySelector(
          ".panel-pane.pane-entity-field.pane-node-field-rec-tools"
        )
        ?.remove();
      document.querySelector("#block-block-2")?.remove();
      document.querySelector(".field-name-field-tags")?.remove();
      document
        .querySelector(
          ".panel-pane.pane-entity-field.pane-node-field-yield.inline-field"
        )
        ?.remove();

      document.querySelector("#mys-wrapper")?.remove();

     
      const skipCount = 2;
      
      const allLinks = Array.from(document.querySelectorAll("a"));
      
      allLinks.slice(skipCount).forEach((link) => {
        link.replaceWith(link.textContent); // replaces links within the page the to text skip <a> tag becuase img is link 
      });
    });

    // Get the modified HTML content
    await page.screenshot({ path: "after.png", fullPage: true });
    const modifiedHtml = await page.content();
    await page.close();

    res.send(modifiedHtml);
  } catch (error) {
    console.error("Error modifying page:", error);
    res.status(500).send("Error processing the page");
  }
});

// Mount routers with proper base paths
app.use('/api/recipes', recipesRouter);

app.use('/api/bmi', bmiRouter);
app.use('/api/ai-insights', aiInsightsRouter);

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
