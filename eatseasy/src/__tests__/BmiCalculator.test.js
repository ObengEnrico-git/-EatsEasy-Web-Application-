// BmiCalculator.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import BmiCalculator from "../pages/BmiCalculator";
import MealPlan from "../pages/MealPlan";

describe("BmiCalculator Component", () => {
  

  test("allows user to select gender", async () => {
    render(
      <MemoryRouter>
        <BmiCalculator />
      </MemoryRouter>
    );

    const maleRadio = screen.getAllByLabelText(/Male/i)[0];
    const femaleRadio = screen.getByLabelText(/Female/i);

    expect(maleRadio).not.toBeChecked();
    expect(femaleRadio).not.toBeChecked();

    // Simulate selecting the "Male" radio button
    userEvent.click(maleRadio);
    expect(maleRadio).toBeChecked();
    expect(femaleRadio).not.toBeChecked();
  });

 

 

 

  
});
