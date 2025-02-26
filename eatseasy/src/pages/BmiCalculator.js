// BmiCalculator.js
import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import "../styles/BmiCalculator.css";
import Select from 'react-select';
import axios from 'axios';
import Cookies from "js-cookie";

const BmiCalculator = () => {
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState('kg');
    const [gender, setGender] = useState('');
    const [heightFeet, setHeightFeet] = useState('');
    const [heightInches, setHeightInches] = useState('');
    const [height, setHeight] = useState('');
    const [heightUnit, setHeightUnit] = useState('cm');
    const [bmi, setBmi] = useState(null);
    const [status, setStatus] = useState('');
    const [age, setAge] = useState('');
    const [optionPicked, setOptionPicked] = useState("");
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const [isCalculated, setIsCalculated] = useState(false);
    const navigate = useNavigate(); // React Router hook
    const [weightGoal, setWeightGoal] = useState("");
    const [showGoalPopup, setShowGoalPopup] = useState(false);

    useEffect(() => {
        // Check for stored BMI in cookies
        const storedBMI = Cookies.get('bmiData');
        if (storedBMI) {
          const parsedData = JSON.parse(storedBMI);
          setBmi(parsedData.bmi);
          setStatus(parsedData.status);
          setWeightGoal(parsedData.weightGoal);
          setIsCalculated(true);
        }
      }, []);

    const convertFeetAndInchesToCm = (feet, inches) => feet * 30.48 + inches * 2.54;
    const convertPoundsToKg = (pounds) => pounds * 0.453592;

    const calculateBMI = (e) => {
        e.preventDefault();

        // check their weight, gender and age for edge cases 

        if (!weight || weight <= 0 || !age || age <= 0 || !gender) {
            alert('Please enter valid values for weight, age, and gender.');
            return;
        }

        // check if they are above 18 

        if (age < 18) {
            alert("You must be above the age of 18 to calculate recipes");
            return;
        } else if (age > 80) {
            // adjust this alert so it redirects them to the reciepe page with no calorie calculation
            alert("Unfortunetly, our calculator won't accurately work for you.");
            return;
        }

        // check if their weight or height is sensible 

        // if (weight <= 30 || height <= 120 || weight >= 250 || height >= 210) {
        //     alert("Please enter a valid weight or height");
        //     return;
        // }

        // Unit the conversion

        let heightInCm;
    if (heightUnit === 'cm') {
        heightInCm = parseFloat(height);
        if (!heightInCm || heightInCm <= 0) {
            alert('Please enter a valid height in cm.');
            return;
        }
    } else {
        const feet = parseFloat(heightFeet) || 0;
        const inches = parseFloat(heightInches) || 0;
        heightInCm = convertFeetAndInchesToCm(feet, inches);
        if (heightInCm <= 0) {
            alert('Please enter valid height in feet and inches.');
            return;
        }
    }

    const weightInKg = weightUnit === 'kg' ? parseFloat(weight) : convertPoundsToKg(parseFloat(weight));
    const heightInMeters = heightInCm / 100;
    const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);

    // Set the BMI value
    setBmi(bmiValue);

    let bmiStatus = '';
    let recommendedGoal = '';

    if (bmiValue < 18.5) {
        bmiStatus = 'Underweight';
        recommendedGoal = 'gain';
    } else if (bmiValue < 24.9) {
        bmiStatus = 'Normal weight';
        recommendedGoal = 'maintain';
    } else if (bmiValue < 29.9) {
        bmiStatus = 'Overweight';
        recommendedGoal = 'lose';
    } else {
        bmiStatus = 'Obesity';
        recommendedGoal = 'lose';
    }

    setStatus(bmiStatus);
    setWeightGoal(recommendedGoal);
    setIsCalculated(true);
    setShowGoalPopup(true);

    Cookies.set('bmiData', JSON.stringify({ bmi: bmiValue, status: bmiStatus, weightGoal: recommendedGoal }), { expires: 7 });
  };



    const calculateCalorieCount = () => {
    if (!isCalculated) return null;

    const heightInCm = heightUnit === 'cm'
        ? parseFloat(height)
        : convertFeetAndInchesToCm(parseFloat(heightFeet) || 0, parseFloat(heightInches) || 0);
    const weightInKg = weightUnit === 'kg'
        ? parseFloat(weight)
        : convertPoundsToKg(parseFloat(weight));

    let BMR = 0;
    if (gender === "Male") {
        BMR = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
    } else if (gender === "Female") {
        BMR = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    }

    let activityMultiplier = 1.2;
    switch (optionPicked.value) {
        case "Sedentary: little or no exercise":
            activityMultiplier = 1.2;
            break;
        case "Light: exercise 1-3 times a week":
            activityMultiplier = 1.375;
            break;
        case "Moderate: exercise 4-5 times a week":
            activityMultiplier = 1.55;
            break;
        case "Active: intense exercise 4-5 times a week":
            activityMultiplier = 1.725;
            break;
        case "Very Active: intense exercise 6-7 times a week":
            activityMultiplier = 1.9;
            break;
        default:
            break;
    }

    const TDEE = BMR * activityMultiplier;

    // Adjust target calories based on the chosen weight goal
    let targetCalories = TDEE;
    if (weightGoal === "lose") {
        targetCalories -= 500;
    } else if (weightGoal === "gain") {
        targetCalories += 500;
    }

    // Fetch recipes based on calorie count
    fetchMealPlan(targetCalories);
};

    const fetchMealPlan = async (targetCalories) => {
    try {
        const response = await axios.get('http://localhost:8000/mealplan', {
            params: { targetCalories }, // Pass calorie data to backend
        });
        const mealData = response.data;

        navigate('/mealplan', { state: { mealData } }); // Redirect to meal plan page with data
    } catch (error) {
        console.error('Error fetching meal plan:', error);
    }
};


    const options = [
        {value: "Basal Metabolic Rate (BMR)", label: "Basal Metabolic Rate (BMR)"},
        {value: "Sedentary: little or no exercise", label: "Sedentary: little or no exercise"},
        {value: "Light: exercise 1-3 times a week", label: "Light: exercise 1-3 times a week"},
        {value: "Moderate: exercise 4-5 times a week", label: "Moderate: exercise 4-5 times a week"},
        {
            value: "Active: daily exercise or intense exercise 3-4 times a week",
            label: "Active: intense exercise 4-5 times a week"
        },
        {
            value: "Very Active: intense exercise 6-7 times a week",
            label: "Very Active: intense exercise 6-7 times a week"
        },
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: "8px",
            boxShadow: "none",
            textAlign: "left",
            minHeight: "45px",
            fontSize: "16px",
        }),
        option: (provided, state) => ({
            ...provided,
            color: "black",
            backgroundColor: state.isSelected ? "lightgrey" : "white",
            fontSize: "16px",
            padding: "10px",
        })
    };

    const resetForm = () => {
        setWeight('');
        setWeightUnit('kg');
        setGender('');
        setHeight('');
        setHeightUnit('cm');
        setBmi(null);
        setStatus('');
        setAge('');
        setOptionPicked('');
        setIsCalculated(false);
    };

    return (
        <div>
            <NavBar/>
            <div className='bmiCalculator-page-container'>
                <div className='container'>
                    <h1>EatsEasy</h1>
                    <form onSubmit={calculateBMI}>
                        <div className='bmiCalculator-radio-option'>
                            <label>
                                Male
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                    disabled={isCalculated}
                                />
                            </label>
                            <label>
                                Female
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                    disabled={isCalculated}
                                />
                            </label>
                        </div>
                        <div className='bmiCalculator-input-group'>
                            <label>
                                Age
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder='Enter your age'
                                    required
                                    disabled={isCalculated}
                                />
                            </label>
                        </div>

                        <div className='bmiCalculator-input-group'>
                            <label>Weight:</label>
                            <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                                <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder='Enter your weight'
                                        required
                                        disabled={isCalculated}
                                    />
                                    <div style={{display: "flex", gap: "0.5rem"}}>
                                        <label style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
                                            <input
                                                type="radio"
                                                name="weightUnit"
                                                value="kg"
                                                checked={weightUnit === "kg"}
                                                onChange={(e) => setWeightUnit(e.target.value)}
                                                disabled={isCalculated}
                                            />
                                            kg
                                        </label>
                                        <label style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
                                            <input
                                                type="radio"
                                                name="weightUnit"
                                                value="lbs"
                                                checked={weightUnit === "lbs"}
                                                onChange={(e) => setWeightUnit(e.target.value)}
                                                disabled={isCalculated}
                                            />
                                            lbs
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='bmiCalculator-input-group'>
                            <label>Height:</label>
                            <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                                <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                                    {heightUnit === 'cm' ? (
                                        <input
                                            type="number"
                                            style={{width: "410px"}}
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            placeholder='Enter height in cm'
                                            required
                                            disabled={isCalculated}
                                        />
                                    ) : (
                                        <div style={{display: "flex", gap: "0.5rem"}}>
                                            <input
                                                type="number"
                                                style={{width: "200px"}}
                                                value={heightFeet}
                                                onChange={(e) => setHeightFeet(e.target.value)}
                                                placeholder='Feet'
                                                required
                                                disabled={isCalculated}
                                            />
                                            <input
                                                type="number"
                                                style={{width: "200px"}}
                                                value={heightInches}
                                                onChange={(e) => setHeightInches(e.target.value)}
                                                placeholder='Inches'
                                                required
                                                disabled={isCalculated}
                                            />
                                        </div>
                                    )}
                                    <div style={{display: "flex", gap: "0.5rem"}}>
                                        <label style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
                                            <input
                                                type="radio"
                                                name="heightUnit"
                                                value="cm"
                                                checked={heightUnit === "cm"}
                                                onChange={(e) => setHeightUnit(e.target.value)}
                                                disabled={isCalculated}
                                            />
                                            cm
                                        </label>
                                        <label style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
                                            <input
                                                type="radio"
                                                name="heightUnit"
                                                value="Feet & Inches"
                                                checked={heightUnit === "Feet & Inches"}
                                                onChange={(e) => setHeightUnit(e.target.value)}
                                                disabled={isCalculated}
                                            />
                                            Feet & Inches
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {showGoalPopup && (
                            <div className="bmiCalculator-popup-overlay"
                                 onClick={() => setShowGoalPopup(false)}>
                                <div className="bmiCalculator-popup-content"
                                     onClick={(e) => e.stopPropagation()}>
                                    <h2 className="text-white">Select Your Weight Goal</h2>

                                    
                                    <button
                                        onClick={() => setIsInfoVisible(!isInfoVisible)}
                                        className="toggle-button"
                                    >
                                        {isInfoVisible ? "Hide BMI and Status ▲" : "View BMI and Status ▼"}
                                    </button>

                                    
                                    {isInfoVisible && (
                                        <div className="bmiCalculator-bmi-details">
                                            <p><strong>BMI:</strong> {bmi}</p>
                                            <p><strong>Status:</strong> {status}</p>
                                        </div>
                                    )}

                                    <p className="bmiCalculator-bmi-recommendation">Based on your BMI, we recommend you
                                        to <strong>{weightGoal}</strong> weight.</p>
                                    <div className="bmiCalculator-goal-buttons">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setWeightGoal("lose");
                                                setShowGoalPopup(false);
                                                calculateCalorieCount();
                                            }}
                                            className={weightGoal === "lose" ? "highlighted" : ""}
                                        >
                                            Lose Weight
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setWeightGoal("maintain");
                                                setShowGoalPopup(false);
                                                calculateCalorieCount();
                                            }}
                                            className={weightGoal === "maintain" ? "highlighted" : ""}
                                        >
                                            Maintain Weight
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setWeightGoal("gain");
                                                setShowGoalPopup(false);
                                                calculateCalorieCount();
                                            }}
                                            className={weightGoal === "gain" ? "highlighted" : ""}
                                        >
                                            Gain Weight
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className='bmiCalculator-input-group'>
                            Activity Level:
                            <Select
                                options={options}
                                styles={customStyles}
                                onChange={(option) => setOptionPicked(option)}
                                isDisabled={isCalculated}
                            />
                        </div>
                        {!isCalculated ? (
                            <button type="submit">Calculate</button>
                        ) : (
                            <>
                                <button onClick={calculateCalorieCount} className="bmiCalculator-nav-button">
                                    Create Customised Recipes
                                </button>
                                <br></br>
                                <button type="button" onClick={resetForm}>Reset</button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
    }
;
export default BmiCalculator;