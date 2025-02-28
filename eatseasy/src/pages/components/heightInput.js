import React, { useState, useEffect, useRef } from "react";
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
  const [measurements, setMeasurements] = useState("");
  const [error, setError] = useState("");
  const originalUnitRef = useRef(unit);

  const measurementsOptions = [
    { value: "cm", label: "Centimeters (cm)" },
    { value: "ft", label: "Feet (ft)" },
  ];


  // On mount, if a value is provided, prefill the state
  useEffect(() => {
    if (value) {
      if (unit === "cm") {
        setMeasurements(value);
      } else if (unit === "ft") {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          const totalInches = numericValue / 2.54;
          const ft = Math.floor(totalInches / 12);
          const inch = Math.round(totalInches % 12);
          setFeet(ft.toString());
          setInches(inch.toString());
          // Also store a combined value (in ft) for the parent if needed
          setMeasurements(ft + inch / 12);
        }
      }
      if (onHeightChange) {
        onHeightChange(value);
      }
    }
  }, [value, unit, onHeightChange]);

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setError("");
    if (originalUnitRef.current !== newUnit && measurements !== "") {
      // Convert the current measurement to the new unit
      const numericValue = parseFloat(measurements);
      if (!isNaN(numericValue)) {
        if (newUnit === "ft") {
          // Convert from cm to ft: use 1 cm = 0.393701 in
          const totalInches = numericValue * 0.393701;
          const ft = Math.floor(totalInches / 12);
          const inch = Math.round(totalInches % 12);
          setFeet(ft.toString());
          setInches(inch.toString());
          // Optionally update measurements to a ft value (optional)
          setMeasurements(ft + inch / 12);
        } else {
          // Convert from ft to cm: assume measurements is in ft
          // (if measurements is stored as a number in ft, convert back to cm)
          const cmValue = numericValue * 30.48;
          setMeasurements(cmValue.toFixed(2));
        }
      }
      originalUnitRef.current = newUnit;
    }
    if (UnitChange) {
      UnitChange(newUnit);
    }
  };

  const handleNumberInput = (e, setter) => {
    const value = e.target.value;
    if (!isNaN(value) && value.trim() !== "") {
      setter(value);
      setError("");
    } else {
      setter("");
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
    if (isNaN(numericValue)) return "";
    if (toUnit === "ft") {
      return (numericValue * 0.393701).toFixed(2); // convert cm to inches then format later
    } else {
      return (numericValue / 0.393701).toFixed(2); // convert inches to cm
    }
  };

  // When the unit changes, convert the current measurement accordingly.
  useEffect(() => {
    if (originalUnitRef.current !== unit && measurements !== "") {
      setMeasurements((prev) => {
        return convertMeasurements(prev, unit);
      });
      originalUnitRef.current = unit;
    }
  }, [unit, measurements]);

  // Lift state: notify the parent when measurements change.
  useEffect(() => {
    if (onHeightChange) {
      onHeightChange(measurements);
    }
  }, [measurements, onHeightChange]);

  return (
    <div className="relative">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {unit === "cm" ? (
          <FloatingLabelInput
            id="heightInput"
            label={label}
            type="number"
            value={measurements}
            onChange={(e) => {
              setMeasurements(e.target.value);
              onHeightChange(e.target.value);
            }}
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
              onChange={(e) => handleNumberInput(e, setFeet)}
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
              onChange={(e) => handleNumberInput(e, setInches)}
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
