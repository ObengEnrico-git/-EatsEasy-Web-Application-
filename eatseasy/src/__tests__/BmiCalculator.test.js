// BmiCalculator.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import BmiCalculator from "../pages/BmiCalculator";
import MealPlan from "../pages/MealPlan";

describe("BmiCalculator Component", () => {
  test("The website renders correctly", () => {
    render(
      <MemoryRouter>
        <BmiCalculator />
      </MemoryRouter>
    );

    // Select the radio buttons
    const maleRadio = screen.getByRole("radio", { name: "Male" });
    const femaleRadio = screen.getByRole("radio", { name: "Female" });

    // Verify the radio buttons exist
    expect(maleRadio).toBeInTheDocument();
    expect(femaleRadio).toBeInTheDocument();

    // Check for all text elements
    expect(screen.getByText(/EatsEasy/i)).toBeInTheDocument();
    expect(screen.getByText(/Weight:/i)).toBeInTheDocument();
    expect(screen.getByText(/Height:/i)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();

    //check bar progress bar

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    //need to check rendering of pop-up
  });

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

  test("allows user to enter age", () => {
    render(
      <MemoryRouter>
        <BmiCalculator />
      </MemoryRouter>
    );

    const ageInput = screen.getByPlaceholderText(/Enter your age/i);
    userEvent.type(ageInput, "25");

    expect(ageInput).toHaveValue(25);
  });

  test("allows user to enter weight and switch units", () => {
    render(
      <MemoryRouter>
        <BmiCalculator />
      </MemoryRouter>
    );

    const weightInput = screen.getByPlaceholderText(/Enter your weight/i);
    userEvent.type(weightInput, "70");

    expect(weightInput).toHaveValue(70);

    const lbsRadio = screen.getByLabelText(/lbs/i);
    userEvent.click(lbsRadio);

    expect(lbsRadio).toBeChecked();
  });

  test("allows user to enter height and switch units", () => {
    render(
      <MemoryRouter>
        <BmiCalculator />
      </MemoryRouter>
    );

    const heightInput = screen.getByPlaceholderText(/Enter height in cm/i);
    userEvent.type(heightInput, "170");

    expect(heightInput).toHaveValue(170);

    const feetRadio = screen.getByLabelText(/Feet & Inches/i);
    userEvent.click(feetRadio);

    expect(feetRadio).toBeChecked();
  });

  test("allows user go to step2 ", async () => {
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

    const ageInput = screen.getByPlaceholderText(/Enter your age/i);
    userEvent.type(ageInput, "25");

    const heightInput = screen.getByPlaceholderText(/Enter height in cm/i);
    userEvent.type(heightInput, "100");

    const weightInput = screen.getByPlaceholderText(/Enter your weight/i);
    userEvent.type(weightInput, "70");

    userEvent.click(screen.getByRole("button", { name: /Next/i }));
    // Wait for form2 to appear in the DOM

    await waitFor(() =>
      expect(screen.getByTestId("form2")).toBeInTheDocument()
    );
  });

  
});
