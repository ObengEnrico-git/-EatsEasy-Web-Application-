// BmiCalculator.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
jest.mock('axios');
import axiosMock from 'axios';
import BmiCalculator from '../pages/BmiCalculator';



describe("BmiCalculator Component", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <BmiCalculator />
            </MemoryRouter>
        );
    });

    test('renders the BMI Calculator form correctly', () => {
        expect(screen.getByText(/EatsEasy/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Age/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Weight:/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Height:/i)).toBeInTheDocument();
    });

    test('allows user to select gender', async () => {
        const maleRadio = screen.getAllByLabelText(/Male/i);
        const femaleRadio = screen.getByLabelText(/Female/i);

        expect(maleRadio).not.toBeChecked();
        expect(femaleRadio).not.toBeChecked();

        userEvent.click(maleRadio);
        expect(maleRadio).toBeChecked();
    });

    test('allows user to enter age', () => {
        const ageInput = screen.getByPlaceholderText(/Enter your age/i);
        userEvent.type(ageInput, '25');

        expect(ageInput).toHaveValue(25);
    });

    test('allows user to enter weight and switch units', () => {
        const weightInput = screen.getByPlaceholderText(/Enter your weight/i);
        userEvent.type(weightInput, '70');

        expect(weightInput).toHaveValue(70);

        const lbsRadio = screen.getByLabelText(/lbs/i);
        userEvent.click(lbsRadio);

        expect(lbsRadio).toBeChecked();
    });

    test('allows user to enter height and switch units', () => {
        const heightInput = screen.getByPlaceholderText(/Enter height in cm/i);
        userEvent.type(heightInput, '170');

        expect(heightInput).toHaveValue(170);

        const feetRadio = screen.getByLabelText(/Feet & Inches/i);
        userEvent.click(feetRadio);

        expect(feetRadio).toBeChecked();
    });

    test('calculates BMI and displays results', async () => {
        // Enter required values
        userEvent.click(screen.getByLabelText(/Male/i));
        userEvent.type(screen.getByPlaceholderText(/Enter your age/i), '25');
        userEvent.type(screen.getByPlaceholderText(/Enter your weight/i), '70');
        userEvent.type(screen.getByPlaceholderText(/Enter height in cm/i), '170');

        // Click calculate
        userEvent.click(screen.getByText(/Calculate/i));

        // Wait for the BMI result to appear
        await waitFor(() => {
            expect(screen.getByText(/BMI:/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/Normal weight/i)).toBeInTheDocument();
    });

    test('allows user to select activity level', async () => {
        userEvent.click(screen.getByText(/Activity Level:/i));
        userEvent.click(screen.getByText(/Moderate: exercise 4-5 times a week/i));

        expect(screen.getByText(/Moderate: exercise 4-5 times a week/i)).toBeInTheDocument();
    });

    test('calculates and fetches meal plan based on calorie count', async () => {
        // Mock API response
        axiosMock.get('http://localhost:8000/mealplan').reply(200);

        // Fill in all inputs
        userEvent.click(screen.getAllByLabelText(/Male/i));
        userEvent.type(screen.getByPlaceholderText(/Enter your age/i), '25');
        userEvent.type(screen.getByPlaceholderText(/Enter your weight/i), '70');
        userEvent.type(screen.getByPlaceholderText(/Enter height in cm/i), '170');

        // Calculate BMI
        userEvent.click(screen.getByText(/Calculate/i));
        await waitFor(() => screen.getByText(/BMI:/i));

        // Select weight goal
        userEvent.click(screen.getByText(/Lose Weight/i));

        // Wait for navigation mock
        await waitFor(() => {
            expect(mock.history.get.length).toBe(1);
        });
    });

    test("user can select weight goal (Lose, Maintain, Gain)", async () => {
        // Input values and calculate BMI
        userEvent.click(screen.getByLabelText(/Male/i));
        userEvent.type(screen.getByPlaceholderText(/Enter your age/i), "25");
        userEvent.type(screen.getByPlaceholderText(/Enter your weight/i), "70");
        userEvent.type(screen.getByPlaceholderText(/Enter height in cm/i), "175");
        fireEvent.click(screen.getByText(/Calculate/i));

        // Wait for weight goal popup
        await waitFor(() => screen.getByText(/Select Your Weight Goal/i));

        // Click on "Lose Weight" button
        const loseWeightButton = screen.getByText(/Lose Weight/i);
        fireEvent.click(loseWeightButton);

        // Ensure calorie calculation is triggered
        await waitFor(() => expect(screen.getByText(/Create Customised Recipes/i)).toBeInTheDocument());
    });

    test('resets the form when clicking reset', async () => {
        userEvent.click(screen.getByLabelText(/Male/i));
        userEvent.type(screen.getByPlaceholderText(/Enter your age/i), '25');
        userEvent.type(screen.getByPlaceholderText(/Enter your weight/i), '70');
        userEvent.type(screen.getByPlaceholderText(/Enter height in cm/i), '170');

        userEvent.click(screen.getByText(/Calculate/i));
        await waitFor(() => screen.getByText(/BMI:/i));

        userEvent.click(screen.getByText(/Reset/i));

        expect(screen.getByPlaceholderText(/Enter your age/i)).toHaveValue(null);
        expect(screen.getByPlaceholderText(/Enter your weight/i)).toHaveValue(null);
        expect(screen.getByPlaceholderText(/Enter height in cm/i)).toHaveValue(null);
    });
});
