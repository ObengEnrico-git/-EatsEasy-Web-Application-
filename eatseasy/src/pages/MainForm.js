import React, { useState } from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import InterestSelector from "./components/FormCompontents/IntolerancesForm";
import DietSelector from "./components/FormCompontents/Dietform";
import PersonalDetailsForms  from "./components/FormCompontents/PersonalDetailsForm"

const MainForm = () => {
  const [page, setPage] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [progress, setProgress] = useState(25);

  const handleSelect = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    
      setPage((prev) => prev + 1);
      setProgress((prev) => (prev < 100 ? prev + 25 : 100));
    
  };

  const pageDisplay = () => {
  if (page === 0) {
    return (
      <InterestSelector
        selectedInterests={selectedInterests}
        handleSelect={handleSelect}
      />
    );
  } else if (page === 1) {
    return (
      <DietSelector
        selectedInterests={selectedInterests}
        handleSelect={handleSelect}
      />
    );
  } else if (page === 2) {
    return <PersonalDetailsForms />;
  }
};

  return (
    <Box
      textAlign="center"
      mt={3}  
      display="flex"
      flexDirection="column"
      alignItems="center"
      component="form"
      aria-labelledby="interest-selection-title"
    >
      {/* Progress Bar */}
      <Box sx={{ width: "100%", maxWidth: "600px", mb: 2 }}>
        <Typography
          variant="body1"
          sx={{ textAlign: "left", fontWeight: "bold" }}
          id="progress-text"
        >
          Step {page + 1} of 4
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          aria-labelledby="progress-text"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: Step ${page + 1} of 4`}
          sx={{
            height: 8,
            borderRadius: 5,
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#FF6A00",
            },
          }}
        />
      </Box>

      {/* Form Content Based on Page Number */}
      {pageDisplay()}

      {/* Next Button */}
      <Box mt={4} sx={{ maxWidth: "600px", width: "100%" }}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#FF6A00",
            color: "#fff",
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderRadius: "30px",
            padding: "12px 0",
            "&:hover": {
              backgroundColor: "#E65A00",
            },
          }}
          onClick={handleNext}
          aria-label="Proceed to the next step"
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default MainForm;
