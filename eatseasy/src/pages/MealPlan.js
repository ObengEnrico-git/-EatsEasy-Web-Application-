import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import "../styles/MealPlan.css";

const MealPlan = () => {
    const location = useLocation();
    const { mealData } = location.state || {};

    // tracks the day 
    const [visibleDay, setVisibleDay] = useState(null);

    const toggleNutrients = (day) => {
        setVisibleDay(visibleDay === day ? null : day); 
    };

    return (
        <div>
            <NavBar />
        <div className='mealplan-container'>
            <h1>Recommended Meals</h1>
            {mealData && mealData.week ? (
                Object.keys(mealData.week).map((day) => (
                    <div className='day-container' key={day}>
                        <h2>
                            {day.charAt(0).toUpperCase() + day.slice(1)} 
                            <button 
                                className="info-button" 
                                onClick={() => toggleNutrients(day)}
                                aria-label={`Toggle nutrients for ${day}`}
                            >
                                More Information
                            </button>
                        </h2>
                        
                        <div className='meal-list'>
                            {mealData.week[day].meals.map((meal) => (
                                <div className='meal-card' key={meal.id}>
                                    <h3>{meal.title}</h3>
                                    <img 
                                        src={`https://spoonacular.com/recipeImages/${meal.id}-312x231.${meal.imageType}`} 
                                        alt={meal.title} 
                                    />
                                    <p>Ready in: {meal.readyInMinutes} minutes</p>
                                    <p>Servings: {meal.servings}</p>
                                    <a href={meal.sourceUrl} target="_blank" rel="noopener noreferrer">View Recipe</a>
                                </div>
                            ))}
                        </div>

                        {visibleDay === day && (
                            <div className='nutrients-info'>
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
            ) : (
                // TODO: Navigate the user back to the home page
                <>
                <p>No meal data available</p>
                <p>Sorry, this page should never turn up</p>
                <p>Please try our bmi calculator again</p>
                <button> Go back</button>
                </>
            )}
        </div>
        </div>
    );
};

export default MealPlan;