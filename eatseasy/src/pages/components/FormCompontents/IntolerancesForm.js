import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2"; // using Grid2

const interests = [
  "Dairy",
  "Egg",
  "Gluten",
  "Grain",
  "Peanut",
  "Seafood",
  "Sesame",
  "Shellfish",
  "Soy",
  "Sulfite",
  "Tree Nut",
  "Wheat",
];

const InterestSelector = ({ selectedInterests, handleSelect }) => {
  const handleKeyPress = (event, interest) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(interest);
    }
  };

  return (
    <Box sx={{ maxWidth: "800px", width: "100%", px: 2, textAlign: "center" }}>
      <Typography
        id="interest-selection-title"
        variant="h5"
        fontWeight="bold"        
        sx={{ mb: 2, color: "black" }}
      >
        Choose Your Intolerances
      </Typography>

      <Grid container spacing={1} justifyContent="center">
        {interests.map((interest) => (
          <Grid item key={interest}>
            <Chip
              label={interest}
              onClick={() => handleSelect(interest)}
              onKeyDown={(event) => handleKeyPress(event, interest)}
              // Remove focus immediately on blur if desired:
              onBlur={(e) => e.currentTarget.blur()}
              disableRipple
              disableFocusRipple
              role="checkbox"
              aria-checked={selectedInterests.includes(interest)}
              tabIndex={0}
              sx={{
                fontSize: "1rem",
                fontWeight: selectedInterests.includes(interest)
                  ? "bold"
                  : "normal",
                backgroundColor: selectedInterests.includes(interest)
                  ? "#78AB80"
                  : "#fff",
                color: selectedInterests.includes(interest) ? "000000" : "#000",
                border: "2px solid grey",
                borderRadius: "30px",
                padding: "20px",
                cursor: "pointer",
                "&:hover": { 
                  backgroundColor: "#78AB80",
                  color: "000000",
                  fontWeight: "bold"
                   
                },
                
                
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InterestSelector;
