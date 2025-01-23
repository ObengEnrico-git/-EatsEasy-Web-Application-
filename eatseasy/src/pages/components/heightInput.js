import React, { useState, useEffect } from "react";
import FloatingLabelInput from "./componentStyles/FloatingLabelInput";
import UnitSelector from "./componentStyles/radioSelector";
import "../../styles/BmiCalculator.css";

export function HeightInput() {
  const [unit, setUnit] = useState("cm");
  const [measurements, setMeasurements] = useState("");
  const [error, setError] = useState("");

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
    setError(""); 
  };

  const handleMeasurementsChange = (e) => {
    const inputValue = e.target.value;
    if (!isNaN(inputValue) && inputValue.trim() !== "") {
      setMeasurements(inputValue);
      setError("");
    } else {
      setMeasurements("");
      setError("Please enter a valid number.");
    }
  };

  // Handle paste event
  const pasteChecks = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("Text");

    if (!isNaN(pastedText) && pastedText.trim() !== "") {
      e.target.value = pastedText;
      setMeasurements(pastedText);
      setError("");
    } else {
      setError("Invalid paste: Only numbers are allowed");
      console.warn("Invalid paste: Only numbers are allowed");
    }
  };

  // Convert between cm <-> in whenever unit changes
  const convertMeasurements = (value, toUnit) => {
    const numericValue = parseFloat(value);
    if (toUnit === "in") {
      return (numericValue / 2.54).toFixed(2);  // Correct cm to in conversion
    } else {
      return (numericValue * 2.54).toFixed(2);  // Correct in to cm conversion
    }
  };

  useEffect(() => {
    setMeasurements((prevMeasurements) => {
      if (prevMeasurements !== "") {
        return convertMeasurements(prevMeasurements, unit);
      }
      return prevMeasurements;
    });
  }, [unit]);

  const measurementsOptions = [
    { value: "cm", label: "Centimeters (cm)" },
    { value: "in", label: "Inches (in)" },
  ];

  return (
    <div className="relative">
      <UnitSelector 
        title="Choose a Unit:" 
        options={measurementsOptions} 
        selectedUnit={unit} 
        onChange={handleUnitChange} 
      />

      {/* Floating Label Input */}
      <FloatingLabelInput
        id="measurements"
        label="Enter measurements"
        type="number"
        value={measurements}
        onChange={handleMeasurementsChange}
        onPaste={pasteChecks}
        onKeyDown={(e) => {
          if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
          }
        }}
        unit={unit}
        required
        min="0"
        error={error}
        helperText={error}
      />

      {/* Error message for screen readers */}
      {error && (
        <span id="measurements-error-text" style={{ color: "red" }} aria-live="assertive">
          {error}
        </span>
      )}
    </div>
  );
}

export default HeightInput;
