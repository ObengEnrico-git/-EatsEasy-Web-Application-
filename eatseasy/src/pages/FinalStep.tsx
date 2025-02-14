// FinalStep.tsx
import React, { useState } from "react";
import { useBmiStore } from "./useBmiStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function FinalStep() {
  const navigate = useNavigate();
  const {
    formData: {
      gender,
      age,
      weight,
      weightUnit,
      heightUnit,
      height,
      heightFeet,
      heightInches,
      activityLevel,
    },
    resetForm,
  } = useBmiStore();

  const [bmi, setBmi] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [weightGoal, setWeightGoal] = useState<"lose" | "maintain" | "gain" | "">(
    ""
  );

  // Convert user data to numeric
  const convertFeetAndInchesToCm = (feet: number, inches: number) =>
    feet * 30.48 + inches * 2.54;
  const convertPoundsToKg = (pounds: number) => pounds * 0.453592;

  // Calculate BMI on mount or on some button click
  React.useEffect(() => {
    const calcBmi = () => {
      const numericAge = Number(age);
      const numericWeight =
        weightUnit === "kg"
          ? Number(weight)
          : convertPoundsToKg(Number(weight));

      let heightInCm = 0;
      if (heightUnit === "cm") {
        heightInCm = Number(height);
      } else {
        const ft = Number(heightFeet);
        const inch = Number(heightInches);
        heightInCm = convertFeetAndInchesToCm(ft, inch);
      }

      const heightInMeters = heightInCm / 100;
      const bmiValue = numericWeight / (heightInMeters * heightInMeters);
      const fixedBmi = parseFloat(bmiValue.toFixed(2));
      setBmi(fixedBmi);

      let stat = "";
      let recommendedGoal: "lose" | "maintain" | "gain" = "maintain";
      if (fixedBmi < 18.5) {
        stat = "Underweight";
        recommendedGoal = "gain";
      } else if (fixedBmi < 24.9) {
        stat = "Normal weight";
        recommendedGoal = "maintain";
      } else if (fixedBmi < 29.9) {
        stat = "Overweight";
        recommendedGoal = "lose";
      } else {
        stat = "Obesity";
        recommendedGoal = "lose";
      }
      setStatus(stat);
      setWeightGoal(recommendedGoal);
    };

    calcBmi();
  }, [age, weight, weightUnit, height, heightFeet, heightInches, heightUnit]);

  // Once user picks a goal, we calculate calories and fetch meal plan
  const calculateCalorieCountAndFetch = async (goal: "lose" | "maintain" | "gain") => {
    // BMR + TDEE logic
    const numericAge = Number(age);
    const numericWeight =
      weightUnit === "kg" ? Number(weight) : convertPoundsToKg(Number(weight));

    let heightInCm = 0;
    if (heightUnit === "cm") {
      heightInCm = Number(height);
    } else {
      heightInCm = convertFeetAndInchesToCm(
        Number(heightFeet),
        Number(heightInches)
      );
    }

    let BMR = 0;
    if (gender === "Male") {
      BMR = 10 * numericWeight + 6.25 * heightInCm - 5 * numericAge + 5;
    } else {
      BMR = 10 * numericWeight + 6.25 * heightInCm - 5 * numericAge - 161;
    }

    let activityMultiplier = 1.2;
    switch (activityLevel) {
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

    // Example of fetching meal plan
    try {
      const response = await axios.get("http://localhost:8000/mealplan", {
        params: { targetCalories },
      });
      const mealData = response.data;

      // Navigate to /mealplan with your mealData
      navigate("/mealplan", { state: { mealData } });
    } catch (error) {
      console.error("Error fetching meal plan:", error);
    }
  };

  return (
    <div>
      <h2>Results</h2>
      {bmi && (
        <>
          <p>
            <strong>BMI:</strong> {bmi} ({status})
          </p>
          <p>
            Based on your BMI, we recommend you to <strong>{weightGoal}</strong> weight.
          </p>
        </>
      )}

      <div style={{ margin: "1rem 0" }}>
        <button onClick={() => calculateCalorieCountAndFetch("lose")}>
          Lose Weight
        </button>
        <button onClick={() => calculateCalorieCountAndFetch("maintain")}>
          Maintain Weight
        </button>
        <button onClick={() => calculateCalorieCountAndFetch("gain")}>
          Gain Weight
        </button>
      </div>

      <button onClick={resetForm}>Start Over</button>
    </div>
  );
}
