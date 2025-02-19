// BmiCalculator.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import BmiCalculator from "../pages/BmiCalculator";
import MealPlan from "../pages/MealPlan";

beforeEach(() => {
  localStorage.clear();
});

describe("BmiCalculator Component", () => {
  test("The website renders correctly", () => {
    render(
      <MemoryRouter>
        <BmiCalculator />
      </MemoryRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Select the radio buttons
    const maleRadio = screen.getByRole("radio", { name: "Male" });
    const femaleRadio = screen.getByRole("radio", { name: "Female" });

    // Verify the radio buttons exist
    expect(maleRadio).toBeInTheDocument();
    expect(femaleRadio).toBeInTheDocument();

    // Check for all text elements
    expect(screen.getByText(/EatsEasy/i)).toBeInTheDocument();

    // Check for age input using test id
    const ageInput = screen.getByTestId("enterAge");
    expect(ageInput).toBeInTheDocument();

    // Use the test id we set in FloatingLabelInput (assuming id="weight" becomes the test id)
    const weightInput = screen.getByTestId("weight");
    expect(weightInput).toBeInTheDocument();

    const kgRadio = screen.getByLabelText(/Kilograms \(kg\)/i);
    expect(kgRadio).toBeInTheDocument();
    expect(kgRadio).toBeChecked();

    const heightInput = screen.getByTestId("heightInput");
    expect(heightInput).toBeInTheDocument();

    const Radio = screen.getByLabelText(/Centimeters \(cm\)/i);
    expect(Radio).toBeInTheDocument();
    expect(Radio).toBeChecked();

    const activityLevel = screen.getByTestId("activity-level");
    expect(activityLevel).toBeInTheDocument();

    expect(screen.getByText(/Next/i)).toBeInTheDocument();
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

    userEvent.click(maleRadio);
    expect(maleRadio).toBeChecked();
    expect(femaleRadio).not.toBeChecked();
  });

  test("allows user to enter age", async () => {
    render(
      <MemoryRouter>
        <BmiCalculator />
      </MemoryRouter>
    );
    //screen.debug();
    const ageInput = screen.getByRole("textbox", { name: /Enter your age/i });

    expect(ageInput).toBeInTheDocument();
    userEvent.type(ageInput, "25");
    expect(ageInput).toHaveValue("25");
  });

  test("allows user to enter weight and switch units", () => {
    render(
      <MemoryRouter>
        <BmiCalculator />
      </MemoryRouter>
    );

    const weightInput = screen.getByRole("textbox", { name: /Enter Weight/i });
    expect(weightInput).toBeInTheDocument();

    const kgRadio = screen.getByLabelText(/Pounds \(lb\)/i);
    expect(kgRadio).toBeInTheDocument();

    userEvent.type(weightInput, "70");

    expect(weightInput).toHaveValue("70");

    const lbsRadio = screen.getByLabelText(/lb/i);
    userEvent.click(lbsRadio);

    expect(lbsRadio).toBeChecked();
  });

  test("allows user to enter height and switch units", () => {
    render(
      <MemoryRouter>
        <BmiCalculator />
      </MemoryRouter>
    );

    const heightInput = screen.getByRole("textbox", { name: /Enter Height/i });
    expect(heightInput).toBeInTheDocument();

    const feetRadio = screen.getByLabelText(/Feet \(ft\)/i);
    const kgRadio = screen.getByLabelText(/Kilograms \(kg\)/i);

    expect(feetRadio).toBeInTheDocument();
    expect(kgRadio).toBeInTheDocument();

    userEvent.type(heightInput, "70");

    expect(heightInput).toHaveValue("70");

    const ftRadio = screen.getByLabelText(/ft/i);
    userEvent.click(ftRadio);

    expect(ftRadio).toBeChecked();
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

    userEvent.click(maleRadio);
    expect(maleRadio).toBeChecked();
    expect(femaleRadio).not.toBeChecked();

    const ageInput = screen.getByRole("textbox", { name: /Enter your age/i });

    expect(ageInput).toBeInTheDocument();
 userEvent.type(ageInput, "25");
    expect(ageInput).toHaveValue("25");

    //weight

    const weightInput = screen.getByRole("textbox", { name: /Enter Weight/i });
    expect(weightInput).toBeInTheDocument();

    userEvent.type(weightInput, "70");

    expect(weightInput).toHaveValue("70");

    const lbsRadio = screen.getByLabelText(/Pound/i);
    userEvent.click(lbsRadio);

    expect(lbsRadio).toBeChecked();


    const heightInput = screen.getByRole("textbox", { name: /Enter Height/i });
    expect(heightInput).toBeInTheDocument();

    const feetRadio = screen.getByLabelText(/Feet \(ft\)/i);
    const kgRadio = screen.getByLabelText(/Kilograms \(kg\)/i);

    expect(feetRadio).toBeInTheDocument();
    expect(kgRadio).toBeInTheDocument();

    userEvent.type(heightInput, "70");

    expect(heightInput).toHaveValue("70");

    const ftRadio = screen.getByLabelText(/ft/i);
    userEvent.click(ftRadio);

    expect(ftRadio).toBeChecked();

    const nextButton = screen.getByRole("button", {
      name: /Proceed to the next step/i,
    });
    userEvent.click(nextButton);

    await waitFor(() =>
      expect(screen.getByTestId("form2")).toBeInTheDocument()
    );

    screen.debug();
  });

 
});
