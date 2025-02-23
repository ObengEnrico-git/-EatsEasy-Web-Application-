import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import "../styles/BmiCalculator.css";
import InterestSelector from "./components/FormCompontents/IntolerancesForm.js";
import { usePersistedState } from "./usePersistedState.tsx";
import axios from "axios";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import FloatingLabelInput from "./components/componentStyles/FloatingLabelInput";
import { styled } from "@mui/material/styles";
import WeightInput from "./components/weightInput";
import HeightInput from "./components/heightInput";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 8,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#E8F5E9", // Light green background for incomplete portion
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#38a169", // Darker green for completed portion
  },
}));

const interestOptions = [
  { value: "Gluten Free", label: "Gluten Free" },
  { value: "Ketogenic", label: "Ketogenic" },
  { value: "Vegetarian", label: "Vegetarian" },
  { value: "Lacto-Vegetarian", label: "Lacto-Vegetarian" },
  { value: "Ovo-Vegetarian", label: "Ovo-Vegetarian" },
  { value: "Vegan", label: "Vegan" },
  { value: "Pescetarian", label: "Pescetarian" },
  { value: "Paleo", label: "Paleo" },
  { value: "Primal", label: "Primal" },
  { value: "Low FODMAP", label: "Low FODMAP" },
  { value: "Whole30", label: "Whole30" },
];

// Add these constants before the BmiCalculator component
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedItems, theme) {
  return {
    fontWeight: selectedItems.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const BmiCalculator = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = usePersistedState("weight", "");
  const [weightUnit, setWeightUnit] = usePersistedState("weightUnit", "kg");
  const [gender, setGender] = usePersistedState("gender", "");

  const [height, setHeight] = usePersistedState("height", "");

  const [heightUnit, setHeightUnit] = usePersistedState("heightUnit", "cm");
  const [age, setAge] = usePersistedState("age", "");
  const [diet, setDietOptions] = usePersistedState("diet", []);
  const [error, setError] = useState("");

  const [bmi, setBmi] = usePersistedState("bmi", "");
  const [status, setStatus] = useState("");
  const [optionPicked, setOptionPicked] = usePersistedState("optionPicked", "");
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showGoalPopup, setShowGoalPopup] = useState(false);
  const [weightGoal, setWeightGoal] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  // Add at the top with your other state variables
  const [selectedAllergens, setSelectedAllergens] = usePersistedState(
    "selectedAllergens",
    ""
  );

  const theme = useTheme();

  // Add this useEffect to ensure diet is always an array
  useEffect(() => {
    if (!Array.isArray(diet)) {
      setDietOptions([]);
    }
  }, [diet, setDietOptions]);

  // Handler to toggle an allergen on/off
  const handleAllergenSelect = (allergen) => {
    if (selectedAllergens.includes(allergen)) {
      setSelectedAllergens(selectedAllergens.filter((i) => i !== allergen));
    } else {
      setSelectedAllergens([...selectedAllergens, allergen]);
    }
  };

  const convertFeetAndInchesToCm = (height) => height * 30.48;
  const convertPoundsToKg = (pounds) => pounds * 0.453592;

  const goToStep2 = (e) => {
    //next button in the first form
    e.preventDefault();

    if (!weight || weight <= 0 || !age || age <= 0 || !gender) {
      alert("Please enter valid values for weight, age, and gender.");
      return;
    }

    if (age < 18) {
      alert("You must be above the age of 18 to calculate recipes");
      return;
    } else if (age > 80) {
      alert("Unfortunately, our calculator won't accurately work for you.");
      return;
    }

    let heightInCm;
    if (heightUnit === "cm") {
      heightInCm = parseFloat(height);
      if (!heightInCm || heightInCm <= 0) {
        alert("Please enter a valid height in cm.");
        return;
      }
    } else {
      heightInCm = convertFeetAndInchesToCm(height);
      if (heightInCm <= 0) {
        alert("Please enter valid height in feet and inches.");
        return;
      }
    }

    setCurrentStep(2);
    window.history.pushState({ step: 2 }, "");
  };

   // Listen to popstate events (browser back button)
  useEffect(() => {
    const handlePopState = (event) => {
      // Check the history state or simply go back one step
      if (currentStep === 2) {
        setCurrentStep(1);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentStep]);

  const calculateBMI = () => {
    let heightInCm;
    if (heightUnit === "cm") {
      heightInCm = parseFloat(height);
    } else {
      heightInCm = convertFeetAndInchesToCm(height);
    }
    const weightInKg =
      weightUnit === "kg"
        ? parseFloat(weight)
        : convertPoundsToKg(parseFloat(weight));
    const heightInMeters = heightInCm / 100;
    const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(
      2
    );

    setBmi(bmiValue);

    let bmiStatus = "";
    let recommendedGoal = "";

    if (bmiValue < 18.5) {
      bmiStatus = "Underweight";
      recommendedGoal = "gain";
    } else if (bmiValue < 24.9) {
      bmiStatus = "Normal weight";
      recommendedGoal = "maintain";
    } else if (bmiValue < 29.9) {
      bmiStatus = "Overweight";
      recommendedGoal = "lose";
    } else {
      bmiStatus = "Obesity";
      recommendedGoal = "lose";
    }

    setStatus(bmiStatus);
    setWeightGoal(recommendedGoal);
    setIsCalculated(true);
    setShowGoalPopup(true);
   
  };

  const calculateCalorieCount = (goal) => {
    if (!isCalculated) return null;

    const heightInCm =
      heightUnit === "cm"
        ? parseFloat(height)
        : convertFeetAndInchesToCm(parseFloat(height));
    const weightInKg =
      weightUnit === "kg"
        ? parseFloat(weight)
        : convertPoundsToKg(parseFloat(weight));

    let BMR = 0;
    if (gender === "Male") {
      BMR = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
    } else {
      BMR = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    }

    let activityMultiplier = 1.2;
    switch (optionPicked.value) {
      case "Sedentary: little or no exercise":
        activityMultiplier = 1.2;
        break;
      case "Light: exercise 1-3 times a week":
        activityMultiplier = 1.375;
        break;
      case "Moderate: exercise 4-5 times a week":
        activityMultiplier = 1.55;
        break;
      case "Active: intense exercise 4-5 times a week":
        activityMultiplier = 1.725;
        break;
      case "Very Active: intense exercise 6-7 times a week":
        activityMultiplier = 1.9;
        break;
      default:
        break;
    }

    const TDEE = BMR * activityMultiplier;

    let targetCalories = TDEE;
    if (goal === "lose") {
      targetCalories -= 500;
    } else if (goal === "gain") {
      targetCalories += 500;
    }

    fetchMealPlan(targetCalories);
    console.log(targetCalories);
    console.log(diet);

    console.log(selectedAllergens);
  };

  const fetchMealPlan = async (targetCalories) => {
    try {
      const response = await axios.get("http://localhost:8000/mealplan", {
        params: {
          targetCalories,
          targetDiet: diet.join(","),
          targetAllergen: selectedAllergens.join(","),
        },
      });
      const mealData = response.data;
      navigate("/mealplan", {
        state: {
          mealData,
          targetCalories,
          diet,
          allergen: { value: selectedAllergens.join(",") },
        },
      });
    } catch (error) {
      console.error("Error fetching meal plan:", error);
    }
  };

 

  // Handle paste event
  const pasteChecks = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("Text");
    if (!isNaN(pastedText) && pastedText.trim() !== "") {
      e.target.value = pastedText;
      setAge(pastedText);
      setError("");
    } else {
      setError("Invalid paste: Only numbers are allowed");
      console.warn("Invalid paste: Only numbers are allowed");
    }
  };

  const handleMeasurementsChange = (e) => {
    const inputValue = e.target.value;
    if (!isNaN(inputValue) && inputValue.trim() !== "") {
      setAge(inputValue);
      setError("");
    } else {
      setAge("");
      setError("Please enter a valid number.");
    }
  };

  const goBackStep = () => {
    setCurrentStep(1);
  };

  return (
    <div>
      <NavBar />
      <div
        className="bmiCalculator-page-container"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div className="container">
          <h1>EatsEasy</h1>

          <Typography sx={{ color: "gray", mb: 2, textAlign: "center" }}>
            We'll personalise your meal plan based on you and your preferences
          </Typography>

          <Box sx={{ width: "100%", maxWidth: "700px", mb: 5 }}>
            <Typography
              variant="body1"
              sx={{ textAlign: "left", fontWeight: "bold" }}
              id="progress-text"
            >
              Step {currentStep} of 2
            </Typography>
            <BorderLinearProgress
              variant="determinate"
              value={currentStep === 1 ? 50 : 100}
              aria-labelledby="progress-text"
            />
          </Box>

          {/* STEP 1:  */}
          {currentStep === 1 && (
            <form onSubmit={goToStep2}>
              <div className="bmiCalculator-radio-option">
                <FormControl
                  component="fieldset"
                  required
                  disabled={isCalculated}
                >
                  <FormLabel
                    component="legend"
                    sx={{ textAlign: "center", color: "black" }}
                  >
                    Gender
                  </FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <FormControlLabel
                      value="Male"
                      control={<Radio required />}
                      label="Male"
                      sx={{ mx: 2, color: "black" }}
                    />
                    <FormControlLabel
                      value="Female"
                      control={<Radio required />}
                      label="Female"
                      sx={{ mx: 2, color: "black" }}
                    />
                  </RadioGroup>
                </FormControl>
              </div>

              <div className="bmiCalculator-input-group">
                <label data-testid="age-input">
                  <FloatingLabelInput
                    id= "enterAge"
                    label="Enter your age"
                    type="number"
                    value={age}
                    onChange={handleMeasurementsChange}
                    onPaste={pasteChecks}
                    required
                    min="0"
                    error={error}
                    
                  />
                </label>
              </div>

              {/* Weight Input */}
              <div className="bmiCalculator-input-group">
                <WeightInput
                  disabled={isCalculated}   
                  label="Enter Weight"
                  

                  onWeightChange={(val) => setWeight(val)}
                  unit={weightUnit}
                  onUnitChange={(newUnit) => setWeightUnit(newUnit)}
                />
              </div>

              {/* Height Input */}
              <div className="bmiCalculator-input-group">
                <HeightInput
                  disabled={isCalculated}
                  label="Enter Height "
                  onHeightChange={(val) => setHeight(val)}
                  unit={heightUnit}
                  UnitChange={(newUnit) => setHeightUnit(newUnit)}
                />
              </div>

              <div className="bmiCalculator-input-group">
                <FloatingLabelInput
                  id="activity-level"
                  label="Activity Level"
                  type="select" // This makes it render a select dropdown
                  value={optionPicked}
                  onChange={(e) => setOptionPicked(e.target.value)}
                  options={[
                    {
                      value: "Basal Metabolic Rate (BMR)",
                      label: "Basal Metabolic Rate (BMR)",
                    },
                    {
                      value: "Sedentary: little or no exercise",
                      label: "Sedentary: little or no exercise",
                    },
                    {
                      value: "Light: exercise 1-3 times a week",
                      label: "Light: exercise 1-3 times a week",
                    },
                    {
                      value: "Moderate: exercise 4-5 times a week",
                      label: "Moderate: exercise 4-5 times a week",
                    },
                    {
                      value:
                        "Active: daily exercise or intense exercise 3-4 times a week",
                      label: "Active: intense exercise 4-5 times a week",
                    },
                    {
                      value: "Very Active: intense exercise 6-7 times a week",
                      label: "Very Active: intense exercise 6-7 times a week",
                    },
                  ]}
                  
                  disabled={isCalculated}
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#38a169",
                  color: "#fff",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  borderRadius: "30px",
                  padding: "12px 0",
                  "&:hover": {
                    backgroundColor: "FFFFFF",
                  },
                }}
                aria-label="Proceed to the next step"
              >
                Next
              </Button>
            </form>
          )}

          {/* step2: Diet Interest + Allergen */}
          {currentStep === 2 && (
            <form
              data-testid="form2"
              onSubmit={(e) => {
                e.preventDefault();
                calculateBMI();
              }}
            >
              {
                <div>
                  <div>
                    <h2 className="text-black md:mb-3 mb-1 font-bold text-2xl">
                      Select Diet Preferences
                    </h2>

                    <div className="bmiCalculator-input-group">
                      <div data-testid="dropdown-diet" className="md:mb-11 mb-10">
                        <FormControl sx={{ width: '100%' }}>
                          <InputLabel id="diet-preferences-label">Diet Preferences</InputLabel>
                          <Select
                            labelId="diet-preferences-label"
                            id="diet-preferences"
                            multiple
                            value={diet}
                            onChange={(e) => setDietOptions(e.target.value)}
                            input={<OutlinedInput label="Diet Preferences" />}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {interestOptions.map((option) => (
                              <MenuItem
                                key={option.value}
                                value={option.value}
                                style={getStyles(option.value, diet, theme)}
                              >
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>

                    <div className="bmiCalculator-input-group md:mb-10 mb-5">
                      <InterestSelector
                        selectedInterests={selectedAllergens}
                        handleSelect={handleAllergenSelect}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#38a169",
                      color: "#fff",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      borderRadius: "30px",
                      padding: "12px 0",
                      mt: 5,
                      "&:hover": {
                        backgroundColor: "FFFFFF",
                      },
                    }}
                    aria-label="Proceed to the next step"
                  >
                    Calculate
                  </Button>

                  <Button
                    type="submit"
                    onClick={goBackStep}
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#38a169",
                      color: "#fff",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      borderRadius: "30px",
                      padding: "12px 0",
                      mt: 5,
                      "&:hover": {
                        backgroundColor: "FFFFFF",
                      },
                    }}
                    aria-label="Proceed to the next step"
                  >
                    Back
                  </Button>

                  {/* <button onClick={resetForm} style={{ marginTop: "20px" }}>
                    Reset{" "}
                  </button> */}
                </div>
                }
            </form>
          )}
          

          {showGoalPopup && (
            <div
              className="bmiCalculator-popup-overlay"
              onClick={() => setShowGoalPopup(false)} // forces user to click by setting it true
            >
              <div
                className="bmiCalculator-popup-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-white">Select Your Weight Goal</h2>

                <button
                  onClick={() => setIsInfoVisible(!isInfoVisible)}
                  className="toggle-button"
                >
                  {isInfoVisible
                    ? "Hide BMI and Status ▲"
                    : "View BMI and Status ▼"}
                </button>

                {isInfoVisible && (
                  <div className="bmiCalculator-bmi-details">
                    <p>
                      <strong>BMI:</strong> {bmi}
                    </p>
                    <p>
                      <strong>Status:</strong> {status}
                    </p>
                  </div>
                )}

                <p className="bmiCalculator-bmi-recommendation">
                  Based on your BMI, we recommend you to{" "}
                  <strong>{weightGoal}</strong> weight.
                </p>
                <div className="bmiCalculator-goal-buttons">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWeightGoal("lose");
                      setShowGoalPopup(false);
                      calculateCalorieCount("lose");
                    }}
                    className={weightGoal === "lose" ? "highlighted" : ""}
                  >
                    Lose Weight
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWeightGoal("maintain");
                      setShowGoalPopup(false);
                      calculateCalorieCount("maintain");
                    }}
                    className={weightGoal === "maintain" ? "highlighted" : ""}
                  >
                    Maintain Weight
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWeightGoal("gain");
                      setShowGoalPopup(false);
                      calculateCalorieCount("gain"); // passed value
                    }}
                    className={weightGoal === "gain" ? "highlighted" : ""}
                  >
                    Gain Weight
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BmiCalculator;
