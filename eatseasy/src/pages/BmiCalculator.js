// BmiCalculator.js
import React, { useState } from 'react';
import "../styles/BmiCalculator.css";
import Select from 'react-select';

const BmiCalculator = () => {
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [status, setStatus] = useState('');
    const [age, setAge] = useState('');
    const [optionPicked, setOptionPicked] = useState("");
    const [isInfoVisible, setIsInfoVisible] = useState(false); 
    const [isCalculated, setIsCalculated] = useState(false);
    

    const calculateBMI = (e) => {
        e.preventDefault();
        
        // check their weight, height, gender and age for edge cases 

        if (!weight || weight <= 0 || !height || height <= 0 || !gender || !age || age <= 0) {
            alert('Please enter valid positive numbers for weight, age, height or select a gender.');
            return;
        }

        // check if they are above 18 

        if (age < 18) {
            alert("You must be above the age of 18 to calculate recipes");
            return;
        } else if (age > 80 ) {
            // adjust this alert so it redirects them to the reciepe page with no calorie calculation
            alert("Unfortunetly, our calculator won't accurately work for you.");
            return;
        }

        // check if their weight or height is sensible 

        if (weight <= 30 || height <= 120 || weight >= 250 || height >= 210) {
            alert("Please enter a valid weight or height");
            return;
        }

        // Enrico this is where the conversion happens
        
        const heightInMeters = parseFloat(height) / 100;
        const bmiValue = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(2);
        setBmi(bmiValue);

        let bmiStatus = '';
        if (bmiValue < 18.5) {
            bmiStatus = 'Underweight';
        } else if (bmiValue < 24.9) {
            bmiStatus = 'Normal weight';
        } else if (bmiValue < 29.9) {
            bmiStatus = 'Overweight';
        } else {
            bmiStatus = 'Obesity';
        }
        setStatus(bmiStatus);
        setIsCalculated(true);
    };

    const calculateCalorieCount = () => {
        if (!isCalculated) return null;
        
        let BMR = 0;
        if (gender === "Male") {
            BMR = 10 * weight + 6.25 * height - 5 * age + 5;
        } else if (gender === "Woman") {
            BMR = 10 * weight + 6.25 * height - 5 * age - 161;
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

        return (
            <div className='result'>
                <h3>Your BMR is: {BMR.toFixed(2)}</h3>
                <h3>Your TDEE is (to maintain your current weight) is: {TDEE.toFixed(2)} calories/day</h3>
                {displayRecommendation()}
            </div>
        );
    };

    const displayRecommendation = () => {
        if (status === "Underweight") {
            return <p>We recommend you to <b>increase</b> your intake.</p>;
        } else if (status === "Normal weight") {
            return <p>We recommend <b>maintaining</b> your current intake.</p>;
        } else if (status === "Overweight" || status === "Obesity") {
            return <p>We recommend <b>reducing</b> your current intake.</p>;
        }
        return null;
    };

    const handleToggleInfo = () => {
        setIsInfoVisible(!isInfoVisible);
    };

    const options = [
        { value: "Basal Metabolic Rate (BMR)", label: "Basal Metabolic Rate (BMR)"},
        { value: "Sedentary: little or no exercise", label: "Sedentary: little or no exercise"},
        { value: "Light: exercise 1-3 times a week", label: "Light: exercise 1-3 times a week"},
        { value: "Moderate: exercise 4-5 times a week", label: "Moderate: exercise 4-5 times a week" },
        { value: "Active: daily exercise or intense exercise 3-4 times a week", label: "Active: intense exercise 4-5 times a week"},
        { value: "Very Active: intense exercise 6-7 times a week", label: "Very Active: intense exercise 6-7 times a week"},
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: "8px",
            boxShadow: "none",
            textAlign: "left",

        }),
        option: (provided, state) => ({ ...provided, color:"black", backgroundColor: state.isSelected ? "lightgrey" : "white",    
        })
    };

    const resetForm = () => {
        setWeight('');
        setGender('');
        setHeight('');
        setBmi(null);
        setStatus('');
        setAge('');
        setOptionPicked('');
        setIsCalculated(false);
    };

    return (
        <div className='page-container'>
            <div className='info-container'>
                <h2 onClick={handleToggleInfo} style={{ cursor: "pointer" }}>
                    Your Details {isInfoVisible ? '▲' : '▼'}
                </h2>
                {isInfoVisible && (
                    <div>
                        <p><strong>BMI:</strong> {bmi}</p>
                        <p><strong>Status:</strong> {status}</p>
                        {isCalculated && calculateCalorieCount()}
                    </div>
                )}
            </div>
            <div className='container'>
                <h1>EatsEasy</h1>
                <form onSubmit={calculateBMI}>
                    <div className='radio-option'>
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
                            Woman
                            <input
                                type="radio"
                                name="gender"
                                value="Woman"
                                onChange={(e) => setGender(e.target.value)}
                                required
                                disabled={isCalculated}
                            />
                        </label>
                    </div>
                    <div className='input-group'>
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
                    <div className='input-group'>
                        <label>
                            Weight (kg):
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder='Enter your weight'
                                required
                                disabled={isCalculated}
                            />
                        </label>
                    </div>
                    <div className='input-group'>
                        <label>
                            Height (cm):
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder='Enter your height'
                                required
                                disabled={isCalculated}
                            />
                        </label>
                    </div>
                    <div className='input-group'>
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
                            <button onClick={() => {}} className="nav-button">Create Customized Recipes </button>
                            <br></br>
                            <button type="button" onClick={resetForm}>Reset</button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default BmiCalculator;