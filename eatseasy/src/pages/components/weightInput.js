import React, { useState, useEffect } from "react";
import FloatingLabelInput from "./componentStyles/FloatingLabelInput";
import UnitSelector from "./componentStyles/radioSelector";
import "../../styles/BmiCalculator.css";

export function WeightInput() {
  const [unit, setUnit] = useState("kg");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState(""); // <-- New: track error messages

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
    setError(""); // Clear error on unit change (optional)
  };

  const handleWeightChange = (e) => {
    const inputValue = e.target.value;
    if (!isNaN(inputValue) && inputValue.trim() !== "") {
      setWeight(inputValue);
      setError(""); // Clear error if it's now valid
    } else {
      setWeight("");
    }
  };

  // Handle paste event
  const pasteChecks = (e) => {
    e.preventDefault(); // Prevent default paste
    const pastedText = e.clipboardData.getData("Text");

    // Validate if pasted text is numeric
    if (!isNaN(pastedText) && pastedText.trim() !== "") {
      e.target.value = pastedText; // Manually set the value
      setWeight(pastedText);
      setError(""); // Clear any previous error
    } else {
      setError("Invalid paste: Only numbers are allowed");
      console.warn("Invalid paste: Only numbers are allowed");
    }
  };

  // Convert between kg <-> lb whenever unit changes (if weight is present)
  const convertWeight = (value, toUnit) => {
    const numericValue = parseFloat(value);
    if (toUnit === "lb") {
      return (numericValue * 2.20462).toFixed(2);
    } else {
      return (numericValue / 2.20462).toFixed(2);
    }
  };

  useEffect(() => {
  setWeight((prevWeight) => {
    if (prevWeight !== "") {
      return convertWeight(prevWeight, unit);
    }
    return prevWeight;
  });
}, [unit]);

   const weightOptions = [
    { value: "kg", label: "Kilograms (kg)" },
    { value: "lb", label: "Pounds (lb)" },
  ];

  return (
    <div className="relative">
      <UnitSelector 
        title="Choose a Unit:" 
        options={weightOptions} 
        selectedUnit={unit} 
        onChange={handleUnitChange} 
      />


      {/* Floating Label Input */}
      <FloatingLabelInput
        id="weight"
        label="Enter Weight"
        type="number"
        value={weight}
        onChange={handleWeightChange}
        onPaste={pasteChecks}
        onKeyDown={(e) => {
          // Block "e", "E", "+", "-" from being typed
          if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
          }
        }}
        unit={unit}
        required
        min="0"
       error = {error}
      />

     
    </div>
  );
}

export default WeightInput;
