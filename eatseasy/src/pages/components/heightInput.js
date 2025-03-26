import React, { useState, useEffect } from "react";
import FloatingLabelInput from "./componentStyles/FloatingLabelInput";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import "../../styles/BmiCalculator.css";

export function HeightInput({ disabled = false, onHeightChange, unit, UnitChange, label, value }) {
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [cmValue, setCmValue] = useState("");
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initial setup based on unit and value
  useEffect(() => {
    // Only handle the initial values or when units change externally
    if (!isInitialized) {
      if (value) {
        if (unit === "cm") {
          setCmValue(value);
        } else if (unit === "ft") {
          const numericValue = parseFloat(value);
          if (!isNaN(numericValue)) {
            const wholeFeet = Math.floor(numericValue);
            const decimalPart = numericValue - wholeFeet;
            const inchesValue = Math.round(decimalPart * 12);
            
            setFeet(wholeFeet.toString());
            setInches(inchesValue.toString());
          }
        }
      }
      setIsInitialized(true);
    }
  }, [unit, value, isInitialized]); // Include the dependencies

  // Handle unit change
  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setError("");
    
    // Convert values when switching units
    if (newUnit === "cm" && unit === "ft" && feet !== "") {
      // Convert from feet/inches to cm
      const feetValue = parseFloat(feet || "0");
      const inchesValue = parseFloat(inches || "0");
      
      if (!isNaN(feetValue) || !isNaN(inchesValue)) {
        const totalFeet = feetValue + (inchesValue / 12);
        const cmValue = (totalFeet * 30.48).toFixed(2);
        setCmValue(cmValue);
        
        // Update parent component with new value in cm
        if (onHeightChange) {
          onHeightChange(cmValue);
        }
      }
    } 
    else if (newUnit === "ft" && unit === "cm" && cmValue !== "") {
      // Convert from cm to feet/inches
      const cm = parseFloat(cmValue);
      
      if (!isNaN(cm)) {
        // Convert to inches first
        const totalInches = cm / 2.54;
        // Calculate feet and remaining inches
        const feetValue = Math.floor(totalInches / 12);
        const inchesValue = Math.round(totalInches % 12);
        
        setFeet(feetValue.toString());
        setInches(inchesValue.toString());
        
        // Update parent component with new value in feet
        if (onHeightChange) {
          onHeightChange((feetValue + (inchesValue / 12)).toFixed(2));
        }
      }
    }
    
    // Update the unit in parent component
    if (UnitChange) {
      UnitChange(newUnit);
    }
  };

  // Handle cm input change
  const handleCmChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value.trim() !== "") {
      setCmValue(value);
      setError("");
      
      // Update parent value
      if (onHeightChange) {
        onHeightChange(value);
      }
    } else {
      setCmValue("");
      setError("Please enter a valid number.");
    }
  };

  // Handle feet input change
  const handleFeetChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value.trim() !== "") {
      setFeet(value);
      setError("");
      
      // Update parent with combined value
      updateCombinedValue(value, inches);
    } else {
      setFeet("");
      setError("Please enter a valid number.");
    }
  };

  // Handle inches input change
  const handleInchesChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value.trim() !== "") {
      setInches(value);
      setError("");
      
      // Update parent with combined value
      updateCombinedValue(feet, value);
    } else {
      setInches("");
      setError("Please enter a valid number.");
    }
  };

  // Helper function to update the combined feet+inches value and notify parent
  const updateCombinedValue = (feetVal, inchesVal) => {
    const feetValue = parseFloat(feetVal || "0");
    const inchesValue = parseFloat(inchesVal || "0");
    
    if (!isNaN(feetValue) || !isNaN(inchesValue)) {
      const combinedValue = feetValue + (inchesValue / 12);
      if (onHeightChange) {
        onHeightChange(combinedValue.toFixed(2));
      }
    }
  };

  // Handle paste event
  const pasteChecks = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("Text");
    if (!isNaN(pastedText) && pastedText.trim() !== "") {
      e.target.value = pastedText;
      
      if (unit === "cm") {
        setCmValue(pastedText);
        if (onHeightChange) {
          onHeightChange(pastedText);
        }
      }
      
      setError("");
    } else {
      setError("Invalid paste: Only numbers are allowed");
      console.warn("Invalid paste: Only numbers are allowed");
    }
  };

  return (
    <div className="relative">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {unit === "cm" ? (
          <FloatingLabelInput
            id="heightInput"
            label={label}
            type="number"
            value={cmValue}
            onChange={handleCmChange}
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
        ) : (
          <div style={{ display: "flex", gap: "1rem", flex: 1 }}>
            <FloatingLabelInput
              id="feetInput"
              label="Feet"
              type="number"
              value={feet}
              onChange={handleFeetChange}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              required
              min="0"
              error={error}
              disabled={disabled}
            />
            <FloatingLabelInput
              id="inchesInput"
              label="Inches"
              type="number"
              value={inches}
              onChange={handleInchesChange}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              required
              min="0"
              max="11"
              error={error}
              disabled={disabled}
            />
          </div>
        )}

        <FormControl component="fieldset" disabled={disabled}>
          <RadioGroup
            row
            name="heightUnit"
            value={unit}
            onChange={handleUnitChange}
          >
            {[
              { value: "cm", label: "Centimetres (cm)" },
              { value: "ft", label: "Feet (ft)" },
            ].map((option) => (
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
