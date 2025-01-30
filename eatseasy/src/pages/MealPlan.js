import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/MealPlan.css";

const MealPlan = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { mealData: initialMealData, TDEE } = location.state || {};
    const [mealData, setMealData] = useState(initialMealData);
    const [isLoading, setIsLoading] = useState(false);

    // tracks the day 
    const [visibleDay, setVisibleDay] = useState(null);

    const [showInfoPanel, setShowInfoPanel] = useState(true);

    const toggleNutrients = (day) => {
        setVisibleDay(visibleDay === day ? null : day); 
    };

    const handleAcknowledge = () => {
        setShowInfoPanel(false);
        document.body.style.overflow = 'auto'; 
    };

    useEffect(() => {
        if (showInfoPanel) {
            document.body.style.overflow = 'hidden'; 
        }
        return () => {
            document.body.style.overflow = 'auto'; 
        };
    }, [showInfoPanel]);

    // this function is legit just copying fetchNewMealPLan within
    // BmiCalculator.js. I know not ideal but for now it works

    const fetchNewMealPlan = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:8000/mealplan', {
                params: { targetCalories: TDEE }
            });
            setMealData(response.data);
        } catch (error) {
            console.error('Error fetching new meal plan:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshMealPlan = () => {
        fetchNewMealPlan();
    };

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className='mealplan-container'>
            {showInfoPanel && mealData && mealData.week && (
                <div className='information-panel-overlay'>
                    <div className='information-panel'>
                        <h3><b>Important Information</b></h3>
                        <p>This meal plan is based on your current BMR and TDEE. 
                            It's recommended to eat a balanced meal plan, with a variety of protein, 
                            carbohydrates, and fats.</p>
                        <br></br>
                        <p>You might see that the recipes serve "4" or "12". 
                            This means the reciepe serves up to that amount, and does not mean to have, 
                            for example, 4 meals of the same reciepe. 
                            You can adjust the serving quantity after clicking "view recipe"</p>
                        <br></br>
                        <p><b><u>Remember to consult your GP / healthcare provider for any drastic changes to your diet.</u></b></p>
                        <button onClick={handleAcknowledge}>Acknowledge</button>
                    </div>
                </div>
            )}
            <h1>Recommended Meals</h1>
            <button
                className="refresh-button"
                onClick={() => refreshMealPlan()}
                aria-label={"Refresh meal plan"}
                disabled={isLoading}
            >
                {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            {!mealData || !mealData.week ? (
                <>
                <p>No meal data available</p>
                <p>Please try our bmi calculator again</p>
                <button onClick={handleGoBack}>Go back</button>
                </>
            ) : (
                Object.keys(mealData.week).map((day) => (
                    <div className='day-container' key={day}>
                        <h2>
                            {day.charAt(0).toUpperCase() + day.slice(1)} 
                            <button 
                                className="info-button" 
                                onClick={() => toggleNutrients(day)}
                                aria-label={`Toggle nutrients for ${day}`}
                                class="no-underline hover:underline ..."
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
                                    <p>This reciepe serves: {meal.servings}</p>
                                    <a href={meal.sourceUrl} target="_blank" rel="noopener noreferrer">View Recipe</a>
                                </div>
                            ))}
                        </div>

                        {visibleDay === day && (
                            <div className='nutrients-info'>
                                <h3><b>Nutritional Information</b></h3>
                                <i>
                                    <p>Calories: {mealData.week[day].nutrients.calories}</p>
                                    <p>Your current calories: {TDEE}</p>
                                    <p>Protein: {mealData.week[day].nutrients.protein}g</p>
                                    <p>Fat: {mealData.week[day].nutrients.fat}g</p>
                                    <p>Carbohydrates: {mealData.week[day].nutrients.carbohydrates}g</p>
                                </i>
                            </div>
                        )}
                    </div>
                ))
            )}
            <div>
                <button onClick={handleGoBack}>Back</button>
            </div>
        </div>
    );
};

export default MealPlan;