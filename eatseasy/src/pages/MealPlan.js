import React, { useState, useEffect, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../landingComponents/Navbar";
import "../styles/MealPlan.css";
import axios from "axios";
import { MdAccessTime } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { Tooltip } from "@mui/material";
import { Snackbar, Button } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Loader = lazy(() => import("./Loader"));

const MealPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    mealData: initialMealData,
    targetCalories,
    diet,
    allergen,
  } = location.state || {};

  const [mealData, setMealData] = useState(initialMealData);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDays, setLoadingDays] = useState({});
  const [viewIsLoading, setViewIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [visibleDay, setVisibleDay] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  const toggleNutrients = (day) => {
    setVisibleDay(visibleDay === day ? null : day);
  };

  const [hoveredHeart, setHoveredHeart] = useState(null);
  const [favouritedMeals, setFavouritedMeals] = useState({});

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleAcknowledge = () => {
    setShowInfoPanel(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
  if (mealData) {
    localStorage.setItem("mealPlan", JSON.stringify(mealData));
  }
}, [mealData]);

  useEffect(() => {
    if (showInfoPanel) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showInfoPanel]);

  const fetchNewMealPlan = async () => {
    try {
      if (!targetCalories || isNaN(targetCalories)) {
        console.error("Invalid TDEE value");
        navigate("/");
        return;
      }
      setIsLoading(true);
      console.log("Diet:", diet);
      console.log("Allergen:", allergen.value);

      const response = await axios.get("http://localhost:8000/mealplan", {
        params: {
          targetCalories: Math.round(targetCalories),
          targetDiet: diet,
          targetAllergen: allergen.value,
        },
      });

      setMealData(response.data);
    } catch (error) {
      console.error("Error fetching new meal plan:", error);
      if (error.response?.status === 400) {
        alert("Invalid calorie target. Please try again.");
        navigate("/");
      } else {
        alert("Failed to fetch meal plan. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDayPlan = async (day) => {
    try {
      if (!targetCalories || isNaN(targetCalories)) {
        console.error("Invalid TDEE value");
        navigate("/");
        return;
      }
      setLoadingDays((prev) => ({ ...prev, [day]: true }));

      const response = await axios.get("http://localhost:8000/daymealplan", {
        params: {
          targetCalories: Math.round(targetCalories),
          targetDiet: diet,
          targetAllergen: allergen.value,
        },
      });

      setMealData((prevMealData) => ({
        ...prevMealData,
        week: {
          ...prevMealData.week,
          [day]: response.data,
        },
      }));
    } catch (error) {
      console.error("Error fetching day plan:", error);
      if (error.response?.status === 400) {
        alert("Invalid calorie target. Please try again.");
        navigate("/");
      } else {
        alert("Failed to fetch day plan. Please try again later.");
      }
    } finally {
      setLoadingDays((prev) => ({ ...prev, [day]: false }));
    }
  };

  const refreshMealPlan = () => {
    fetchNewMealPlan();
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const toggleFavourite = (mealId) => {
    setFavouritedMeals((prev) => ({
      ...prev,
      [mealId]: !prev[mealId],
    }));
  };

  const handleViewRecipe = async (url) => {
    setViewIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/fetchModifiedPage",
        {
          params: { url },
        }
      );
      const newWindow = window.open("", "_blank");
      newWindow.document.open();
      newWindow.document.write(response.data);
      newWindow.document.close();

      newWindow.onhashchange = () => {
        // replaces anything after the # on url dynamically removes anything after to "" (empty)
        newWindow.history.replaceState(
          null,
          "",
          newWindow.location.pathname + newWindow.location.search
        );
      };
    } catch (error) {
      console.error("Error scraping recipe:", error);
    } finally {
      setViewIsLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleFavoriteAll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsSaving(true);
    try {
      // Collect all recipes from the meal plan with day and order information
      const allRecipes = [];
      Object.entries(mealData.week).forEach(([day, dayData]) => {
        dayData.meals.forEach((meal, index) => {
          allRecipes.push({
            title: meal.title,
            imageUrl: `https://spoonacular.com/recipeImages/${meal.id}-312x231.${meal.imageType}`,
            readyInMinutes: meal.readyInMinutes,
            servings: meal.servings,
            sourceUrl: meal.sourceUrl,
            day: day.toLowerCase(), // e.g., 'monday'
            mealOrder: index, // 0 for breakfast, 1 for lunch, 2 for dinner
          });
        });
      });

      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/recipes/save-all",
        {
          recipes: allRecipes,
          weekData: mealData.week,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSaveSuccess(true);
      setOpenSnackbar(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving recipes:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="mealplan-container">
        {showInfoPanel && mealData && mealData.week && (
          <div className="information-panel-overlay">
            <div className="information-panel">
              <h3>
                <b>Important Information</b>
              </h3>
              <p>
                This meal plan is based on your current BMR and TDEE. It's
                recommended to eat a balanced meal plan, with a variety of
                protein, carbohydrates, and fats.
              </p>
              <br />
              <p>
                You might see that the recipes serve "4" or "12". This means the
                recipe serves up to that amount, and does not mean to have, for
                example, 4 meals of the same recipe. You can adjust the serving
                quantity after clicking "view recipe".
              </p>
              <br />
              <p>
                <b>
                  <u>
                    Remember to consult your GP / healthcare provider for any
                    drastic changes to your diet.
                  </u>
                </b>
              </p>
              <button onClick={handleAcknowledge}>Acknowledge</button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          {/*
          <button
            className="refresh-button"
            onClick={refreshMealPlan}
            aria-label="Refresh meal plan"
            disabled={isLoading}
            // style={{
            //   animation: isLoading ? 'spin 1s linear infinite' : 'none'
            // }}  
          >
            {isLoading ? "Refreshing..." : "Refresh All Meals"}
          </button> */}

          <button
            className={`px-6 py-3 rounded-lg transition-all duration-300 font-sans text-base font-bold ${
              isSaving || !isAuthenticated
                ? "bg-gray-300 cursor-not-allowed"
                : saveSuccess
                ? "bg-green-500 text-white"
                : "bg-[#067A46] hover:bg-[#194b34] text-white"
            }`}
            onClick={handleFavoriteAll}
            disabled={isSaving || !isAuthenticated}
          >
            {isSaving
              ? "Saving..."
              : saveSuccess
              ? "Saved!"
              : "Favourite All Meals"}
          </button>
        </div>
        {!mealData || !mealData.week ? (
          <>
            <p>No meal data available</p>
            <p>Please try our bmi calculator again</p>
            <button onClick={handleGoBack}>Go back</button>
          </>
        ) : (
          Object.keys(mealData.week).map((day) => (
            <div className="day-container" key={day}>
              <h2 style={{ fontWeight: "bold", color: "Black" }}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
                <button
                  className="info-button"
                  onClick={() => toggleNutrients(day)}
                  aria-label={`Toggle nutrients for ${day}`}
                >
                  More Information
                </button>
                <button
                  onClick={() => fetchDayPlan(day)}
                  aria-label={`Refresh ${day} meal plan`}
                  disabled={loadingDays[day]}
                >
                  <Tooltip
                    title={`Refresh ${
                      day.charAt(0).toUpperCase() + day.slice(1)
                    }'s meal plan`}
                    placement="top"
                  >
                    <div>
                      {" "}
                      {/* Wrapper div needed for Tooltip to work with disabled button */}
                      <FiRefreshCw
                        className={`refresh-icon ${
                          loadingDays[day] ? "spinning" : ""
                        }`}
                      />
                    </div>
                  </Tooltip>
                </button>
              </h2>
              <div className="meal-list">
                {mealData.week[day].meals.map((meal, index) => (
                  <div className="meal-card" key={meal.id}>
                    <Tooltip title="Like">
                      <div
                        className="heart-icon"
                        onMouseEnter={() => setHoveredHeart(meal.id)} // Track hover
                        onMouseLeave={() => setHoveredHeart(null)} // Reset on unhover
                        onClick={() => toggleFavourite(meal.id)}
                      >
                        {favouritedMeals[meal.id] ||
                        hoveredHeart === meal.id ? (
                          <FaHeart color="red" aria-label="Liked"/>
                        ) : (
                          <FaRegHeart aria-label="Not Liked"/>
                        )}
                      </div>
                    </Tooltip>

                    <div
                      style={{
                        backgroundColor: "#38a169",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        display: "inline-block",
                        textAlign: "left",
                        fontWeight: "bold",
                        marginBottom: "8px",
                        fontSize: "0.9rem",
                      }}
                    >
                      {index === 0
                        ? "Breakfast"
                        : index === 1
                        ? "Lunch"
                        : "Dinner"}
                    </div>
                    <h3>{meal.title}</h3>
                    <img
                      src={`https://spoonacular.com/recipeImages/${meal.id}-312x231.${meal.imageType}`}
                      alt={meal.title}
                    />
                    <div className="meal-info">
                      <div className="meal-info-item">
                        <MdAccessTime className="meal-icon" />
                        {meal.readyInMinutes} minutes
                      </div>
                      <div className="meal-info-item">
                        <IoMdPeople className="meal-icon" />
                        Serves {meal.servings}
                      </div>
                    </div>
                    <a
                      href={meal.sourceUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        handleViewRecipe(meal.sourceUrl);
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Recipe
                    </a>
                    {/* Loader overlay */}
                    {viewIsLoading && (
                      <div>
                        <Suspense fallback={<div>Loading...</div>}>
                          <Loader />
                        </Suspense>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {visibleDay === day && (
                <div className="nutrients-info">
                  <h3>
                    <b>Nutritional Information</b>
                  </h3>
                  <i>
                    <p>Calories: {mealData.week[day].nutrients.calories}</p>
                    <p>Protein: {mealData.week[day].nutrients.protein}g</p>
                    <p>Fat: {mealData.week[day].nutrients.fat}g</p>
                    <p>
                      Carbohydrates:{" "}
                      {mealData.week[day].nutrients.carbohydrates}g
                    </p>
                  </i>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="success"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                navigate("/userprofile");
                handleCloseSnackbar();
              }}
            >
              View
            </Button>
          }
        >
          You can view your favourite meal plan by clicking "View"
          <br />
          Saved on {new Date().toLocaleDateString()} at{" "}
          {new Date().toLocaleTimeString().slice(0, 5)}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default MealPlan;
