// NavBar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import NavBar from '../pages/NavBar';

// Mock components to simulate navigation targets
const Home = () => <div>Home Page</div>;
const BmiCalculator = () => <div>BMI Calculator Page</div>;
const MealPlan = () => <div>Meal Plan Page</div>;
const LoginPage = () => <div>Login Page</div>;

describe('NavBar Component', () => {
    test('renders the navbar correctly', () => {
        render(
          <MemoryRouter>
            <NavBar />
          </MemoryRouter>
        );
        expect(screen.getByText(/Home/i)).toBeInTheDocument();
      });
    });