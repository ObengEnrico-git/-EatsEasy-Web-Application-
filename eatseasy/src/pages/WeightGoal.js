import React, { useState } from "react";
import {
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import "../styles/BmiCalculator.css";

export function WeightGoal({
  setIsInfoVisible,
  isInfoVisible,
  bmi,
  status,
  weightGoal,
  setWeightGoal,
}) {
  const [goal, setGoal] = useState("maintain");

  const handleGoalChange = (e) => {
    setGoal(e.target.value);
    
    setWeightGoal(e.target.value); 
  };

  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => setIsInfoVisible(!isInfoVisible)}
          className="toggle-button"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            color: "black",
          }}
        >
          <span>{isInfoVisible ? "Hide BMI ▲" : "View BMI  ▼"}</span>

          {isInfoVisible && (
            <div>
              <p style={{ marginTop: "20px" }}>
                <strong>BMI:</strong> {bmi}
              </p>
              <p>
                <strong>Status:</strong> {status}
              </p>
              <p>
                <strong>Recommended:</strong> {weightGoal}
              </p>
            </div>
          )}
        </button>
      </div>

      {/* Radio Button Group for Weight Goal */}
      <div
        style={{
          marginTop: "16px",
          textAlign: "center",
          marginBottom: "100px",
        }}
      >
        <FormControl component="fieldset">
          <RadioGroup
            
            name="weightGoal"
            value={goal}
            onChange={handleGoalChange}
            
          >
            <FormControlLabel
              value="lose"
              control={<Radio sx={{ transform: "scale(1.5)" }} />}
              label="Lose"
              
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "1.5rem", // adjust the value as needed
                   color: "black", 
                },
                 marginBottom: "16px", 
              }}
            />
            <FormControlLabel
              value="maintain"
              control={<Radio sx={{ transform: "scale(1.5)" }} />}
              label="Maintain"
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "1.5rem", // adjust the value as needed
                   color: "black", 
                },
                 marginBottom: "16px", 
              }}
            />
            <FormControlLabel
              value="gain"
              control={<Radio sx={{ transform: "scale(1.5)" }} />}
              label="Gain"
             
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "1.5rem", // adjust the value as needed
                   color: "black", 
                },
              }}
            />
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
}
