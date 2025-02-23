import React, { useState, useEffect } from "react";
import FloatingLabelInput from "./componentStyles/FloatingLabelInput";
import {
  FormControl,
  
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import "../../styles/BmiCalculator.css";


export function HeightInput({ disabled = false, onHeightChange , unit,  UnitChange, label    }) {
  // We'll use "cm" and "ft" as units
  
  const [measurements, setMeasurements] = useState("");
  const [error, setError] = useState("");

  const measurementsOptions = [
    { value: "cm", label: "Centimeters (cm)" },
    { value: "ft", label: "Feet (ft)" },
  ];

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    
    setError("");
     if (UnitChange) {
      UnitChange(newUnit); 
  };}

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

  // Convert between cm and ft:
  // If converting from cm to ft, divide by 30.48.
  // If converting from ft to cm, multiply by 30.48.
  const convertMeasurements = (value, toUnit) => {
    const numericValue = parseFloat(value);
    if (toUnit === "ft") {
      return (numericValue / 30.48).toFixed(2);
    } else {
      return (numericValue * 30.48).toFixed(2);
    }
  };

  // When the unit changes, convert the current measurement accordingly.
  useEffect(() => {
    setMeasurements((prev) => {
      if (prev !== "") {
        return convertMeasurements(prev, unit);
      }
      return prev;
    });
  }, [unit]);

  // Lift state: notify the parent when measurements change.
  useEffect(() => {
    if (onHeightChange) {
      onHeightChange(measurements);
    }
  }, [measurements, onHeightChange]);

  return (
    <div className="relative">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* FloatingLabelInput for height value */}
        <FloatingLabelInput
          id="heightInput"
          label={label}
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
          disabled={disabled}
        />

        {/* Material UI radio buttons for unit selection */}
        <FormControl component="fieldset" disabled={disabled}>
          <RadioGroup
            row
            name="heightUnit"
            value={unit}
            onChange={handleUnitChange}
          >
            {measurementsOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio color="primary" />}
                label={option.label}
                className="text-sm font-medium text-gray-900 dark:text-gray-300"
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
      
    </div>
  );
}

export default HeightInput;
