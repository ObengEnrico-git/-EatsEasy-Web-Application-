// BmiCalculator.js
import React, { useState } from 'react';
import './BmiCalculator.css'; // Import the CSS file


const BmiCalculator = () => {

    //define variables
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [status, setStatus] = useState('');

    // Function to calculate BMI
    const calculateBMI = (e) => {
        // Makes sure both weight and height have been entered and are >= 0
        e.preventDefault();
        if (!weight || weight <= 0 || !height || height <= 0) {
            alert('Please enter valid positive numbers for both weight and height');
            return;
        }
        else {
            const heightInMeters = parseFloat(height) / 100;  // converting cm to m
            const bmiValue = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(2);  // BMI calculation = weight(kg)/height(m)^2
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
        }
    };


    // Function to return BMI
    const displayBmiResult = () => {
        if (bmi) {
            return (
                <div className='result'>
                    <h3>Your BMI: {bmi}</h3>
                    <h3>Status: {status}</h3>
                </div>
            );
        }
        return null;
    };


    return (
        <div className='container'>
            <h1>BMI Calculator</h1>
            <form onSubmit={calculateBMI}>
                <div className='input-group'>
                    <label>
                        Weight (kg):
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder='Enter your weight'
                            required // Make this field required
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
                            required // Make this field required
                        />
                    </label>
                </div>
                <button type="submit">Calculate</button>
            </form>
            {displayBmiResult()}
        </div>
    );
};

export default BmiCalculator;
