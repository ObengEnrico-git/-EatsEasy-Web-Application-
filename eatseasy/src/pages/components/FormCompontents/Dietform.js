import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';

const interests = [
    "Gluten Free",
  "Ketogenic",
  "Vegetarian",
  "Lacto-Vegetarian",
  "Ovo-Vegetarian",
  "Vegan",
  "Pescetarian",
  "Paleo",
  "Primal",
  "Low FODMAP",
  "Whole30"
];

const DietSelector = ({ selectedInterests, handleSelect }) => {
  const handleKeyPress = (event, interest) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(interest);
    }
  };

  return (
    <Box sx={{ maxWidth: "800px", width: "100%", px: 2, textAlign: "center" }}>
      <Typography id="interest-selection-title" variant="h5" fontWeight="bold">
        Choose Your dietary needs
      </Typography>
      <Typography sx={{ color: "gray", mb: 3 }}>
         We'll personalize your meal plan based on your preferences.
      </Typography>

      <Grid container spacing={1} justifyContent="center">
        {interests.map((interest) => (
          <Grid item key={interest}>
            <Chip
              label={interest}
              onClick={() => handleSelect(interest)}
              onKeyDown={(event) => handleKeyPress(event, interest)}
              role="checkbox"
              aria-checked={selectedInterests.includes(interest)}
              tabIndex="0"
              sx={{
                fontSize: "1rem",
                fontWeight: selectedInterests.includes(interest) ? "bold" : "normal",
                backgroundColor: selectedInterests.includes(interest) ? "#FF6A00" : "#fff",
                color: selectedInterests.includes(interest) ? "#fff" : "#000",
                border: "3px solid black",
                borderRadius: "30px",
                padding: "20px",
                cursor: "pointer tab",
                "&:hover": {
                  backgroundColor: "#FF6A00",
                  color: "#fff",
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DietSelector;