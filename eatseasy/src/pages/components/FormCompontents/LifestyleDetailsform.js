import React, { useState } from "react";
import FloatingLabelInput from "../componentStyles/FloatingLabelInput";
import WeightInput from "../weightInput"; // Import existing weight component
import { Box, FormControl, FormControlLabel, RadioGroup, Radio, Typography } from "@mui/material";

// Options for activity levels
const activityLevels = [
  { value: "sedentary", label: "Sedentary (little to no exercise)" },
  { value: "light", label: "Lightly Active (exercise 1-3 times/week)" },
  { value: "moderate", label: "Moderately Active (exercise 3-5 times/week)" },
  { value: "active", label: "Very Active (hard exercise 6-7 days/week)" },
  { value: "super", label: "Super Active (athlete-level training)" }
];

// Options for weight goals
const goalOptions = [
  { value: "gain", label: "Gain Weight" },
  { value: "lose", label: "Lose Weight" },
  { value: "maintain", label: "Maintain Weight" }
];

const LifestyleDetailsForm = () => {
  const [activity, setActivity] = useState("");
  const [goal, setGoal] = useState("");

  // Handle activity level selection
  const handleActivityChange = (e) => {
    setActivity(e.target.value);
  };

  // Handle weight goal selection
  const handleGoalChange = (e) => {
    setGoal(e.target.value);
  };

  return (

    
   
    <Box
      className="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        maxWidth: "600px",
        margin: "auto",
      }} 
      
    >

         {/* Main Title */}
      <Typography
        component="h1"
        variant="h4"
        fontWeight="bold"
        sx={{ textAlign: "center", marginBottom: "0px" }}
      >
        Lifestyle Details
      </Typography>

    
      <Typography sx={{ color: "gray", mb: 3 }}>
        We'll personalize your meal plan based on your preferences.
      </Typography>
        
    


        

        
      {/* Existing WeightInput Component */}
      <WeightInput />


      <Typography component="h2" variant="h6" fontWeight="bold"    sx={{ mt: 5 , mb: 1 }}>
          Select Activity Level:
        </Typography>

      {/* Activity Level Dropdown */}
      <FloatingLabelInput
        id="activity-level"
        label="Select Activity Level"
        type="select"
        value={activity}
        onChange={handleActivityChange}
        options={activityLevels}
        required
        
      />

      {/* Weight Goal Selection (Gain, Lose, Maintain) */}
      <FormControl component="fieldset">
       
        <Typography component="h2" variant="h6" fontWeight="bold"   sx={{ mt: 3 , mb: 1 }}>
          Select Your Goal:
        </Typography>
        <RadioGroup row value={goal} onChange={handleGoalChange}>
          {goalOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio
              
                              color="primary"
                              sx={{
                                "& .MuiSvgIcon-root": { fontSize: 32 }, // Increase radio button size
                              }}
                            />}
              label={option.label}
              aria-label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default LifestyleDetailsForm;
