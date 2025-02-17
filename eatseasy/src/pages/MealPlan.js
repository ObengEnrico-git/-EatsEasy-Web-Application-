import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import "../styles/MealPlan.css";
import axios from "axios";
import { MdAccessTime } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";

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

  
  const [visibleDay, setVisibleDay] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  const toggleNutrients = (day) => {
    setVisibleDay(visibleDay === day ? null : day);
  };

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
      setIsLoading(false);
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
      setIsLoading(false);
    }
  };

  const refreshMealPlan = () => {
    fetchNewMealPlan();
  };

  const handleGoBack = () => {
    navigate("/");
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
          {isLoading ? "Refreshing..." : "Refresh"}
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
                >
                  More Information
                </button>
                <button
                  
                  onClick={() => fetchDayPlan(day)} // Refresh only this day
                  aria-label={`Refresh ${day} meal plan`}
                  disabled={isLoading}
                >
                  refresh
                </button>
              </h2>
              <div className="meal-list">
                {mealData.week[day].meals.map((meal) => (
                  <div className="meal-card" key={meal.id}>
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
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Recipe
                    </a>
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
