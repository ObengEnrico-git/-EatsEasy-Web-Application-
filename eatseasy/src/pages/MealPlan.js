import React, { useState, useEffect, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import "../styles/MealPlan.css";
import axios from "axios";
import { MdAccessTime } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";
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

 
  const [mealData, setMealData] = useState(initialMealData );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDays, setLoadingDays] = useState({});
  const [viewIsLoading, setViewIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  
  const [visibleDay, setVisibleDay] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  const toggleNutrients = (day) => {
    setVisibleDay(visibleDay === day ? null : day);
  };


  const [isHovered, setIsHovered] = useState(false);

  const handleAcknowledge = () => {
    setShowInfoPanel(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    if (showInfoPanel) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showInfoPanel]);

  
  // Store recipes in the database
  // This function is used to store recipes in the database
  const storeRecipes = async (meals) => {
    // If the user is not authenticated, skip recipe storage
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping recipe storage');
      return;
    }

    // Get the token from local storage (for authentication)
    const token = localStorage.getItem('token');

    // Store each recipe in the database
    const storeRecipePromises = meals.map(meal => {
      console.log('Storing recipe:', meal.title);

      // Store the recipe in the database
      // The recipe is stored in the database using the /api/recipes route
      // The recipe is stored in the database using the POST method
      // The recipe is stored in the database using the token for authentication
      return axios.post("http://localhost:8000/api/recipes", 
        {
          recipeId: meal.id,
          title: meal.title,
          imageUrl: `https://spoonacular.com/recipeImages/${meal.id}-312x231.${meal.imageType}`,
          readyInMinutes: meal.readyInMinutes,
          servings: meal.servings,
          sourceUrl: meal.sourceUrl
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then(response => {
        if (response.status === 200) {
          console.log(`Recipe "${meal.title}" already exists with ID: ${response.data.recipeId}`);
        } else {
          console.log(`Recipe "${meal.title}" stored with ID: ${response.data.recipeId}`);
        }
      }).catch(error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('Authentication error, clearing token');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } else {
          console.error('Error storing recipe:', meal.title, error);
        }
        return null;
      });
    });

    try {
      // Store all recipes in the database
      await Promise.allSettled(storeRecipePromises);
    } catch (error) {
      console.error('Error processing recipes:', error);
    }
  };

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

      // Store recipes if user is authenticated
      if (response.data.week) {
        Object.values(response.data.week).forEach(day => {
          storeRecipes(day.meals);
        });
      }
      
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
      setLoadingDays(prev => ({ ...prev, [day]: true }));
      
      const response = await axios.get("http://localhost:8000/daymealplan", {
        params: {
          targetCalories: Math.round(targetCalories),
          targetDiet: diet,
          targetAllergen: allergen.value,
        },
      });

      // Store recipes if user is authenticated
      if (response.data.meals) {
        await storeRecipes(response.data.meals);
      }
      
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
      setLoadingDays(prev => ({ ...prev, [day]: false }));
    }
  };

  const refreshMealPlan = () => {
    fetchNewMealPlan();
  };

  const handleGoBack = () => {
    navigate("/");
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

      newWindow.onhashchange = () => { // replaces anything after the # on url dynamically removes anything after to "" (empty) 
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

  // Store initial recipes if user is authenticated
  // This function calls the storeRecipes function (See above)
  // This function is called on load of the page
  useEffect(() => {
    if (initialMealData?.week && isAuthenticated) {
      Object.values(initialMealData.week).forEach(day => {
        storeRecipes(day.meals);
      });
    }
  }, [initialMealData, isAuthenticated]);

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
                recommended to eat a balanced meal plan, with a variety of protein,
                carbohydrates, and fats.
              </p>
              <br />
              <p>
                You might see that the recipes serve "4" or "12". This means the
                recipe serves up to that amount, and does not mean to have, for example,
                4 meals of the same recipe. You can adjust the serving quantity after
                clicking "view recipe".
              </p>
              <br />
              <p>
                <b>
                  <u>
                    Remember to consult your GP / healthcare provider for any drastic
                    changes to your diet.
                  </u>
                </b>
              </p>
              <button onClick={handleAcknowledge}>Acknowledge</button>
            </div>
          </div>
        )}
        <h1>Recommended Meals</h1>
      
        <button
          className="refresh-button"
          onClick={refreshMealPlan}
          aria-label="Refresh meal plan"
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh All Meals"}
        </button>
        {!mealData || !mealData.week ? (
          <>
            <p>No meal data available</p>
            <p>Please try our bmi calculator again</p>
            <button onClick={handleGoBack}>Go back</button>
          </>
        ) : (
          Object.keys(mealData.week).map((day) => (
            <div className="day-container" key={day}>
              <h2>
                {day.charAt(0).toUpperCase() + day.slice(1)}
                <button
                  className="info-button"
                  onClick={() => toggleNutrients(day)}
                  aria-label={`Toggle nutrients for ${day}`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    textDecoration: isHovered ? "underline" : "none",
                  }}
                  >
                  More Information
                </button>
                <button
                  onClick={() => fetchDayPlan(day)}
                  aria-label={`Refresh ${day} meal plan`}
                  disabled={loadingDays[day]}
                >
                  {loadingDays[day] ? "Refreshing..." : "Refresh"}
                </button>
              </h2>
              <div className="meal-list">
                {mealData.week[day].meals.map((meal, index) => (
                  <div className="meal-card" key={meal.id}>
                    <div style={{ 
                      backgroundColor: "#38a169", 
                      color: "white", 
                      padding: "4px 8px",
                      borderRadius: "4px",
                      display: "inline-block",
                      textAlign: "left",
                      fontWeight: "bold", 
                      marginBottom: "8px",
                      fontSize: "0.9rem"
                    }}>
                      {index === 0 ? "Breakfast" : index === 1 ? "Lunch" : "Dinner"}
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
                  <h3><b>Nutritional Information</b></h3>
                  <i>
                    <p>Calories: {mealData.week[day].nutrients.calories}</p>
                    <p>Protein: {mealData.week[day].nutrients.protein}g</p>
                    <p>Fat: {mealData.week[day].nutrients.fat}g</p>
                    <p>Carbohydrates: {mealData.week[day].nutrients.carbohydrates}g</p>
                  </i>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MealPlan;
