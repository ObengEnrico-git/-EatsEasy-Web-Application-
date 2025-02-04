import React, { useState } from "react";
import FloatingLabelInput from "../componentStyles/FloatingLabelInput";
import HeightInput from "../heightInput";
import { Box } from "@mui/material";

const PersonalDetailsForms = () => {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  // Gender options
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  // Handle Age input change
  const handleAgeChange = (e) => {
    const inputValue = e.target.value;
    if (!isNaN(inputValue) && inputValue.trim() !== "" && Number(inputValue) > 0) {
      setAge(inputValue);
    } else {
      setAge("");
    }
  };

  return (
    <Box 
      className="form" 
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        maxWidth: "600px",
        margin: "auto"
      }}
    >
      {/* Gender Dropdown */}
      <FloatingLabelInput
        id="gender"
        label="Select Gender"
        type="select"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        options={genderOptions}
        
       
      />

      {/* Age Input */}
      <FloatingLabelInput
        id="age"
        label="Enter Age"
        type="number"
        value={age}
        onChange={handleAgeChange}
        required
        min="0"
        
        
      />

      {/* Height Input */}
      <HeightInput />

    </Box>
  );
};

export default PersonalDetailsForms;
