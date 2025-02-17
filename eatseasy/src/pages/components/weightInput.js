import React, { useState, useEffect } from "react";
import FloatingLabelInput from "./componentStyles/FloatingLabelInput";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import "../../styles/BmiCalculator.css";

const MaterialUnitSelector = ({
  title = "Choose a Unit",
  options = [],
  selectedUnit,
  onChange,
  groupName = "unit"
}) => {
  return (
    <FormControl component="fieldset">
      {title && (
        <FormLabel component="legend" className="text-xl font-medium text-gray-900 dark:text-gray-300">
          {title}
        </FormLabel>
      )}
      <RadioGroup row name={groupName} value={selectedUnit} onChange={onChange}>
        {options.map((option) => (
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
  );
};

export function WeightInput({ disabled = false, onWeightChange, unit, onUnitChange }) {
  const [weight, setWeight] = useState("");
  const [error, setError] = useState(""); // Track error messages

  // Use the onUnitChange callback to update parent's unit state directly
  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setError(""); // Clear error on unit change (optional)
    if (onUnitChange) {
      onUnitChange(newUnit);
    }
  };

  const handleWeightChange = (e) => {
    const inputValue = e.target.value;
    if (!isNaN(inputValue) && inputValue.trim() !== "") {
      setWeight(inputValue);
      setError(""); // Clear error if it's now valid
    } else {
      setWeight("");
      setError("Please enter a valid number.");
    }
  };

  // Handle paste event
  const pasteChecks = (e) => {
    e.preventDefault(); // Prevent default paste
    const pastedText = e.clipboardData.getData("Text");
    if (!isNaN(pastedText) && pastedText.trim() !== "") {
      e.target.value = pastedText; // Manually set the value
      setWeight(pastedText);
      setError("");
    } else {
      setError("Invalid paste: Only numbers are allowed");
      console.warn("Invalid paste: Only numbers are allowed");
    }
  };

  // Convert between kg and lb 
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

  // Notify parent whenever weight changes
  useEffect(() => {
    if (onWeightChange) {
      onWeightChange(weight);
    }
  }, [weight, onWeightChange]);

  const weightOptions = [
    { value: "kg", label: "Kilograms (kg)" },
    { value: "lb", label: "Pounds (lb)" },
  ];

  return (
    <div className="relative">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Floating Label Input on the left */}
        <FloatingLabelInput
          id="weight"
          label="Enter Weight"
          type="number"
          value={weight}
          onChange={handleWeightChange}
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

        {/* MaterialUnitSelector on the right */}
        <MaterialUnitSelector
          title=""
          options={weightOptions}
          selectedUnit={unit}
          onChange={handleUnitChange}
          groupName="weightUnit"
        />
      </div>
    </div>
  );
}

export default WeightInput;
