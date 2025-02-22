import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import MealPlan from '../pages/MealPlan';

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

  // Test 4: Handles no meal data
  it('displays a message when no meal data is available', () => {
    useLocation.mockReturnValue({ state: {} });

    render(
      <MemoryRouter>
        <MealPlan />
      </MemoryRouter>
    );

    expect(screen.getByText('No meal data available')).toBeInTheDocument();
  });

  // Test 5: Navigates back when "Go back" is clicked
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