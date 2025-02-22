import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserProfile from '../pages/userProfile/UserProfile';
import NotLoggedIn from '../pages/userProfile/NotLoggedIn';

describe('UserProfile Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows not logged in component when no token exists', () => {
    localStorage.removeItem('token');
    
    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    expect(screen.getByText('Not Logged In')).toBeInTheDocument();
  });

  test('shows loading state when token exists', () => {
    localStorage.setItem('token', 'fake-token');
    
    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

describe('NotLoggedIn Component', () => {
  test('renders correctly', () => {
    render(
      <MemoryRouter>
        <NotLoggedIn />
      </MemoryRouter>
    );

    expect(screen.getByText('Not Logged In')).toBeInTheDocument();
    expect(screen.getByText('Please log in to view your profile and access all features.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to login/i })).toBeInTheDocument();
  });

  test('login button is clickable', async () => {
    render(
      <MemoryRouter>
        <NotLoggedIn />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('button', { name: /go to login/i });
    expect(loginButton).toBeInTheDocument();
    
    await userEvent.click(loginButton);
  });
}); 