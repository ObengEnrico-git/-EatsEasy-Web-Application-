import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MealPlan from '../pages/MealPlan';

// Mock axios
jest.mock('axios');

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('MealPlan Component', () => {
  const mockMealData = {
    week: {
      monday: {
        meals: [
          {
            id: 1,
            title: 'Test Meal 1',
            readyInMinutes: 30,
            servings: 4,
            imageType: 'jpg',
            sourceUrl: 'https://example.com/recipe/1',
          },
        ],
        nutrients: {
          calories: 500,
          protein: 20,
          fat: 10,
          carbohydrates: 60,
        },
      },
    },
  };

  const mockLocationState = {
    state: {
      mealData: mockMealData,
      TDEE: 2000,
    },
  };

  beforeEach(() => {
    useLocation.mockReturnValue(mockLocationState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Renders the component with meal data
  it('renders meal data correctly', () => {
    render(
      <MemoryRouter>
        <MealPlan />
      </MemoryRouter>
    );

    expect(screen.getByText('Recommended Meals')).toBeInTheDocument();
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Test Meal 1')).toBeInTheDocument();
    expect(screen.getByText('30 minutes')).toBeInTheDocument();
    expect(screen.getByText('Serves 4')).toBeInTheDocument();
  });

  // Test 2: Toggles nutrient information visibility
  it('toggles nutrient information visibility', () => {
    render(
      <MemoryRouter>
        <MealPlan />
      </MemoryRouter>
    );

    const toggleButton = screen.getByText('More Information');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Nutritional Information')).toBeInTheDocument();
    expect(screen.getByText('Calories: 500')).toBeInTheDocument();
    expect(screen.getByText('Protein: 20g')).toBeInTheDocument();
    expect(screen.getByText('Fat: 10g')).toBeInTheDocument();
    expect(screen.getByText('Carbohydrates: 60g')).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.queryByText('Nutritional Information')).not.toBeInTheDocument();
  });

  // Test 3: Handles the "Acknowledge" button click
  it('hides the information panel when "Acknowledge" is clicked', () => {
    render(
      <MemoryRouter>
        <MealPlan />
      </MemoryRouter>
    );

    const acknowledgeButton = screen.getByText('Acknowledge');
    fireEvent.click(acknowledgeButton);

    expect(screen.queryByText('Important Information')).not.toBeInTheDocument();
  });

  // Test 4: Fetches a new meal plan when "Refresh" is clicked
  it('fetches a new meal plan when refresh button is clicked', async () => {
    axios.get.mockResolvedValueOnce({ data: mockMealData });

    render(
      <MemoryRouter>
        <MealPlan />
      </MemoryRouter>
    );

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/mealplan', {
        params: { targetCalories: 2000 },
      });
    });
  });

  // Test 5: Displays loading state during refresh
  it('displays loading state during refresh', async () => {
    axios.get.mockResolvedValueOnce({ data: mockMealData });

    render(
      <MemoryRouter>
        <MealPlan />
      </MemoryRouter>
    );

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    expect(screen.getByText('Refreshing...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument();
    });
  });

  // Test 6: Handles no meal data
  it('displays a message when no meal data is available', () => {
    useLocation.mockReturnValue({ state: {} });

    render(
      <MemoryRouter>
        <MealPlan />
      </MemoryRouter>
    );

    expect(screen.getByText('No meal data available')).toBeInTheDocument();
    expect(screen.getByText('Please try our bmi calculator again')).toBeInTheDocument();
  });

  // Test 7: Navigates back when "Go back" is clicked
  it('navigates back when "Go back" is clicked', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    useLocation.mockReturnValue({ state: {} });

    render(
      <MemoryRouter>
        <MealPlan />
      </MemoryRouter>
    );

    const goBackButton = screen.getByText('Go back');
    fireEvent.click(goBackButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});