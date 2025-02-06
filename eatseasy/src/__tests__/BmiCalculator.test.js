// BmiCalculator.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import BmiCalculator from '../pages/BmiCalculator';

describe('BmiCalculator Component', () => {
    test(' The website renders correctly', () => {
        // Wrap rendering in React's act function explicitly
        render(
            <MemoryRouter>
                <BmiCalculator />
            </MemoryRouter>
        );

        // Check for the presence of key elements
        expect(screen.getByText(/EatsEasy/i)).toBeInTheDocument(); // Header or brand name
        expect(screen.getByText(/Weight:/i)).toBeInTheDocument(); // Weight input label
        expect(screen.getByText(/Height:/i)).toBeInTheDocument(); // Height input label
        expect(screen.getByText(/Calculate/i)).toBeInTheDocument(); // Calculate button
    });
});
