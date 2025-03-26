import React, { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
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

  // Set initial goal based on weightGoal prop when component mounts
  useEffect(() => {
    if (weightGoal) {
      setGoal(weightGoal);
    }
  }, [weightGoal]);

  const handleGoalChange = (newGoal) => {
    setGoal(newGoal);
    setWeightGoal(newGoal);
  };

  // Determine if a button should be highlighted as recommended
  const isRecommended = (buttonGoal) => {
    return buttonGoal === weightGoal;
  };

  // Format the recommendation text based on weightGoal
  const getRecommendationText = () => {
    const action = weightGoal === "lose" ? "lose" : 
                  weightGoal === "gain" ? "gain" : "maintain";
    
    return (
      <>
        Based on your BMI and calculations, we recommend you to{" "}
        <span style={{ 
          fontWeight: "bold", 
          color: "#38a169" 
        }}>
          {action}
        </span>
        {" "}weight
      </>
    );
  };

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "center",
      }}>
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
          <span>{isInfoVisible ? "Hide BMI & Status ▲" : "View BMI & Status ▼"}</span>

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

      {/* Recommendation text */}
      <div style={{
        margin: "25px 0",
        textAlign: "center",
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: "medium",
            color: "#13290C",
            fontSize: "1.1rem",
            padding: "0 10px"
          }}
        >
          {getRecommendationText()}
        </Typography>
      </div>

      {/* Button Group for Weight Goal */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "25px",
          marginBottom: "80px",
        }}
      >
        <div style={{ 
          position: "relative", 
          width: "250px", 
          paddingTop: isRecommended("lose") ? "30px" : "0px"
        }}>
          {isRecommended("lose") && (
            <div style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{ 
                height: "2px", 
                backgroundColor: "#38a169", 
                width: "70px", 
                marginRight: "10px" 
              }} />
              <span style={{ 
                color: "#38a169", 
                fontWeight: "bold", 
                fontSize: "0.85rem",
                textTransform: "none"
              }}>
                Recommended
              </span>
              <div style={{ 
                height: "2px", 
                backgroundColor: "#38a169", 
                width: "70px", 
                marginLeft: "10px" 
              }} />
            </div>
          )}
          <Button
            variant={goal === "lose" ? "contained" : "outlined"}
            onClick={() => handleGoalChange("lose")}
            sx={{
              width: "100%",
              padding: "12px",
              fontSize: "1.2rem",
              borderRadius: "10px",
              fontWeight: goal === "lose" ? "bold" : "normal",
              backgroundColor: goal === "lose" ? "#38a169" : (isRecommended("lose") ? "#e6f7ef" : "white"),
              borderColor: isRecommended("lose") ? "#38a169" : "#bbb",
              borderWidth: isRecommended("lose") ? "2px" : "1px",
              color: goal === "lose" ? "white" : (isRecommended("lose") ? "#38a169" : "black"),
              "&:hover": {
                backgroundColor: goal === "lose" ? "#2f855a" : (isRecommended("lose") ? "#d4f0e2" : "#f5f5f5"),
                borderColor: isRecommended("lose") ? "#2f855a" : "#999",
              },
              transition: "all 0.3s ease",
              textTransform: "none",
            }}
          >
            Lose Weight
          </Button>
        </div>
        
        <div style={{ 
          position: "relative", 
          width: "250px", 
          paddingTop: isRecommended("maintain") ? "30px" : "0px"
        }}>
          {isRecommended("maintain") && (
            <div style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{ 
                height: "2px", 
                backgroundColor: "#38a169", 
                width: "70px", 
                marginRight: "10px" 
              }} />
              <span style={{ 
                color: "#38a169", 
                fontWeight: "bold", 
                fontSize: "0.85rem",
                textTransform: "none"
              }}>
                Recommended
              </span>
              <div style={{ 
                height: "2px", 
                backgroundColor: "#38a169", 
                width: "70px", 
                marginLeft: "10px" 
              }} />
            </div>
          )}
          <Button
            variant={goal === "maintain" ? "contained" : "outlined"}
            onClick={() => handleGoalChange("maintain")}
            sx={{
              width: "100%",
              padding: "12px",
              fontSize: "1.2rem",
              borderRadius: "10px",
              fontWeight: goal === "maintain" ? "bold" : "normal",
              backgroundColor: goal === "maintain" ? "#38a169" : (isRecommended("maintain") ? "#e6f7ef" : "white"),
              borderColor: isRecommended("maintain") ? "#38a169" : "#bbb",
              borderWidth: isRecommended("maintain") ? "2px" : "1px",
              color: goal === "maintain" ? "white" : (isRecommended("maintain") ? "#38a169" : "black"),
              "&:hover": {
                backgroundColor: goal === "maintain" ? "#2f855a" : (isRecommended("maintain") ? "#d4f0e2" : "#f5f5f5"),
                borderColor: isRecommended("maintain") ? "#2f855a" : "#999",
              },
              transition: "all 0.3s ease",
              textTransform: "none",
            }}
          >
            Maintain Weight
          </Button>
        </div>
        
        <div style={{ 
          position: "relative", 
          width: "250px", 
          paddingTop: isRecommended("gain") ? "30px" : "0px"
        }}>
          {isRecommended("gain") && (
            <div style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "none",
            }}>
              <div style={{ 
                height: "2px", 
                backgroundColor: "#38a169", 
                width: "70px", 
                marginRight: "10px",
                textTransform: "none",
              }} />
              <span style={{ 
                color: "#38a169", 
                fontWeight: "bold", 
                fontSize: "0.85rem",
                textTransform: "none"
              }}>
                Recommended
              </span>
              <div style={{ 
                height: "2px", 
                backgroundColor: "#38a169", 
                width: "70px", 
                marginLeft: "10px",
                textTransform: "none",
              }} />
            </div>
          )}
          <Button
            variant={goal === "gain" ? "contained" : "outlined"}
            onClick={() => handleGoalChange("gain")}
            sx={{
              width: "100%",
              padding: "12px",
              fontSize: "1.2rem",
              borderRadius: "10px",
              fontWeight: goal === "gain" ? "bold" : "normal",
              backgroundColor: goal === "gain" ? "#38a169" : (isRecommended("gain") ? "#e6f7ef" : "white"),
              borderColor: isRecommended("gain") ? "#38a169" : "#bbb",
              borderWidth: isRecommended("gain") ? "2px" : "1px",
              color: goal === "gain" ? "white" : (isRecommended("gain") ? "#38a169" : "black"),
              "&:hover": {
                backgroundColor: goal === "gain" ? "#2f855a" : (isRecommended("gain") ? "#d4f0e2" : "#f5f5f5"),
                borderColor: isRecommended("gain") ? "#2f855a" : "#999",
              },
              transition: "all 0.3s ease",
              textTransform: "none",
            }}
          >
            Gain Weight
          </Button>
        </div>
      </div>
    </div>
  );
}
