import { useState, useEffect } from "react";
import {
  Avatar,
  Typography,
  Box,
  Container,
  Backdrop,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../landingComponents/Navbar";
import NotLoggedIn from "./NotLoggedIn";
import FavouriteMealPlans from "./FavouriteMealPlans";
import FavouriteRecipes from "./FavouriteRecipes";
import UserBmi from "./UserBmi";
import CheckIcon from "@mui/icons-material/Check";
import LogoutIcon from "@mui/icons-material/Logout";
import MyChatBot from "./chatBot"

const UserProfile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [bmiData, setBmiData] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [bmiHistory, setBmiHistory] = useState([]);

  
  const handleLoadSavedMealPlan = () => {
    const savedMealPlan = localStorage.getItem("mealPlan");
    if (savedMealPlan) {
      // Parse the JSON string and pass it via navigate state
      navigate("/mealplan", { state: { mealData: JSON.parse(savedMealPlan) } });
    } else {
      alert("No saved meal plan found.");
    }
  };

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Fetch the user's profile data
      // If the user is not authenticated, set the isAuthenticated state to false

      try {
        const response = await fetch("http://localhost:8000/user/profile", {
          headers: {
            // If the user is authenticated, set the isAuthenticated state to true
            // Authorization header is set with the token
            // Bearer is the prefix for the token
            Authorization: `Bearer ${token}`,
          },
        });

        // If the user is not authenticated, set the isAuthenticated state to false
        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        // If the user is authenticated, set the isAuthenticated state to true
        const userData = await response.json();
        // Set the user's profile data to the user state
        setUser(userData);
        // Set the isAuthenticated state to true
        setIsAuthenticated(true);
      } catch (error) {
        // If there is an error, remove the token from the local storage
        // Set the isAuthenticated state to false
        console.error("Auth error:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        // Finally, set the isLoading state to false
        setIsLoading(false);
      }
    };

    // Check if the user is authenticated
    checkAuth();
  }, []);

  const handleLogout = async () => {
    // Set the openBackdrop state to true
    setOpenBackdrop(true);

    // Simulate loading for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Remove the token from the local storage
    localStorage.removeItem("token");
    // Set the openBackdrop state to false
    setOpenBackdrop(false);
    // Set the showLogoutAlert state to true
    setShowLogoutAlert(true);

    // Navigate after a brief delay to show the alert
    setTimeout(() => {
      // Navigate to the login page
      navigate("/login");
      // 1000 milliseconds = 1 second
    }, 1000);
  };

  const uploadAvatar = async () => {
    // Navigate to the upload avatar page
    navigate("/upload-avatar");
  };

  const handleRecipeClick = (recipeId) => {
    // Navigate to the recipe page
    // recipeId is the id of the recipe to navigate to
    // If the user clicks on a recipe, the user will be navigated to the recipe page
    // The /recipe/:id is the route for the recipe page which is not implemented yet
    navigate(`/recipe/${recipeId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      try {
        // Only fetch saved recipes initially as other endpoints aren't implemented yet
        // TODO: Implement the endpoints within index.js
        const savedRecipesRes = await fetch(
          "http://localhost:8000/api/recipes/saved",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!savedRecipesRes.ok) {
          throw new Error(`HTTP error! status: ${savedRecipesRes.status}`);
        }

        const savedRecipesData = await savedRecipesRes.json();
        console.log("Raw saved recipes:", savedRecipesData);

        // Transform the data to match the expected structure
        const formattedSavedRecipes = savedRecipesData.map((plan) => ({
          planId: plan.planId,
          createdAt: plan.createdAt,
          recipes: Object.fromEntries(
            Object.entries(plan.recipes || {}).map(([day, meals]) => [
              day,
              meals.map((meal) => ({
                title: meal.title,
                imageUrl: meal.photo_url,
                readyInMinutes: meal.prep_time,
                servings: meal.servings,
                sourceUrl: meal.recipe_url,
                meal_order: meal.meal_order || 0,
              })),
            ])
          ),
        }));

        console.log("Formatted saved recipes:", formattedSavedRecipes);

        // Set empty arrays for unimplemented endpoints
        setFavoriteRecipes([]);
        setBmiData(null);
        setSavedRecipes(formattedSavedRecipes);

        // Fetch BMI history
        const bmiHistoryRes = await fetch(
          "http://localhost:8000/api/bmi/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!bmiHistoryRes.ok) {
          throw new Error(`HTTP error! status: ${bmiHistoryRes.status}`);
        }

        const bmiHistoryData = await bmiHistoryRes.json();
        console.log("BMI History:", bmiHistoryData);

        // The first record in history is the latest
        const latestBmi = bmiHistoryData[0] || null;
        setBmiHistory(bmiHistoryData);
        setBmiData(latestBmi);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSavedRecipes([]);
        setBmiHistory([]);
        setBmiData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handlePlanDeleted = (deletedPlanId) => {
    // Update the savedRecipes state by filtering out the deleted plan
    setSavedRecipes((prev) =>
      prev.filter((plan) => plan.planId !== deletedPlanId)
    );
  };

  if (isLoading && isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f7f5]">
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          <Typography>Loading...</Typography>
        </div>
      </div>
    );
  }

  // If the user is not authenticated, return the NotLoggedIn component
  if (!isAuthenticated) {
    return <NotLoggedIn />;
  }

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#f5f7f5]">
      <Navbar />
      <MyChatBot options={{ theme: { embedded: false } }} />
      <div className="bg-[#1b4332] text-white">
        <Container maxWidth="lg">
          <Box className="py-16 px-4">
            <Box
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              gap={4}
            >
              {/* Profile section */}
              <Box flex={1}>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", md: "row" }}
                  alignItems={{ xs: "center", md: "flex-start" }}
                  gap={4}
                >
                  <Avatar
                    sx={{ width: 200, height: 200 }}
                    src={
                      user?.avatar || "/placeholder.svg?height=120&width=120"
                    }
                    className="w-24 h-24 md:w-28 md:h-28 border-4 border-[#0000] transform transition-transform hover:scale-105"
                    onClick={() => uploadAvatar()}
                  />
                  <div className="flex flex-col gap-2 text-center md:text-left">
                    <Typography
                      variant="h3"
                      className="font-bold mb-2 text-2xl md:text-3xl"
                    >
                      {user?.username
                        ? capitalizeFirstLetter(user.username)
                        : "Loading..."}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="text-green-200 text-sm md:text-base"
                    >
                      EatsEasy user since{" "}
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString(
                            "en-UK",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "..."}
                    </Typography>
                    <Typography className="text-green-100 mb-4 text-sm md:text-base">
                     {/* {user?.email || "Loading..."}*/}
                    </Typography>
                    {/* Simplified buttons with hover animations */}
                    <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-start">
                      <button
                        onClick={() => navigate("/bmi")}
                        className="px-6 py-2 bg-white font-bold text-black rounded-lg transition-all duration-300 hover:bg-[#D2F895] hover:text-Black hover:scale-105 active:scale-95 w-full sm:w-auto"
                      >
                        BMI Calculator
                      </button>

                      <button
                        onClick={handleLoadSavedMealPlan}
                        className="px-6 py-2 bg-white font-bold text-black rounded-lg transition-all duration-300 hover:bg-[#D2F895] hover:text-Black hover:scale-105 active:scale-95 w-full sm:w-auto"
                      >
                        Meal Plans
                      </button>
                    </div>
                  </div>
                </Box>
              </Box>
              {/* Compact logout button with hover expansion */}
              <Box
                display="flex"
                justifyContent={{ xs: "center", md: "flex-end" }}
                mt={{ xs: 4, md: 0 }}
              >
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 px-3 py-2 bg-white font-bold text-black rounded-lg transition-all duration-300 hover:bg-[#D2F895] hover:text-Black hover:scale-105 active:scale-95 w-[40px] h-[40px] hover:w-[110px] overflow-hidden"
                >
                  <LogoutIcon className="min-w-[24px]" />
                  <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Logout
                  </span>
                </button>
              </Box>
            </Box>
          </Box>
        </Container>
      </div>

      <Container maxWidth="lg" className="py-12">
        {isLoading ? (
          <Box display="flex" justifyContent="center">
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <>
            <UserBmi bmiData={bmiData} bmiHistory={bmiHistory} />

            {/* Saved Weekly Meal Plans using FavoriteMealPlans component */}
            <FavouriteMealPlans
              mealPlans={savedRecipes}
              onHover={setHoveredCard}
              hoveredCard={hoveredCard}
              onMealPlanClick={handleRecipeClick}
              onPlanDeleted={handlePlanDeleted}
            />

            <FavouriteRecipes
              recipes={favoriteRecipes}
              onHover={setHoveredCard}
              hoveredCard={hoveredCard}
              onRecipeClick={handleRecipeClick}
            />
          </>
        )}
      </Container>

      {/* Logout Alert */}
      <Snackbar
        open={showLogoutAlert}
        autoHideDuration={1100}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Successfully logged out
        </Alert>
      </Snackbar>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default UserProfile;
