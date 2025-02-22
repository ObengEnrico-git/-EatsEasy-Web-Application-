import React from 'react';
import { render } from '@testing-library/react';
import LandingPage from '../pages/LandingPage';
import Navbar from '../landingComponents/Navbar';
import Section1 from '../landingComponents/Section1';
import Cards from '../landingComponents/Cards';

jest.mock('../landingComponents/Navbar');
jest.mock('../landingComponents/Section1');
jest.mock('../landingComponents/Cards');

describe('LandingPage', () => {
    beforeEach(() => {
        Navbar.mockImplementation(() => <div>Navbar Component</div>);
        Section1.mockImplementation(() => <div>Section1 Component</div>);
        Cards.mockImplementation(() => <div>Cards Component</div>);
    });

    it('should render Navbar component', () => {
        const { getByText } = render(<LandingPage />);
        expect(getByText('Navbar Component')).toBeInTheDocument();
    });

    it('should render Section1 component', () => {
        const { getByText } = render(<LandingPage />);
        expect(getByText('Section1 Component')).toBeInTheDocument();
    });

    it('should render Cards component', () => {
        const { getByText } = render(<LandingPage />);
        expect(getByText('Cards Component')).toBeInTheDocument();
    });
});