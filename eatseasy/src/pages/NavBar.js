import React, { useState, useEffect } from 'react';
import '../styles/NavBar.css';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const isAuthenticated = localStorage.getItem('token') !== null;

  useEffect(() => {
    const fetchUsername = async () => {
      if (!isAuthenticated) return;

      try {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
          return;
        }

        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setUsername(userData.username);
          localStorage.setItem('username', userData.username);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [isAuthenticated]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint to clear the token cookie
      const response = await fetch('http://localhost:8000/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });
  
      if (response.ok) {
        // Clear all user-related data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('status');
        localStorage.removeItem('bmi');
        localStorage.removeItem('weightGoal');
        localStorage.removeItem('weight');
        localStorage.removeItem('weightUnit');
        localStorage.removeItem('gender');
        localStorage.removeItem('height');
        localStorage.removeItem('heightUnit');
        localStorage.removeItem('age');
        localStorage.removeItem('optionPicked');
        localStorage.removeItem('diet');
        localStorage.removeItem('selectedAllergens');
  
        // Redirect to the login page
        window.location.href = '/login';
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div
          className="navBar-hamburger-container"
          role="button"
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
          onClick={toggleMenu}
        >
          <div className="navBar-hamburger">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>

        <img
          src="/logo192.png"
          alt="EatsEasy Logo"
          className="navBar-logo-image"
          onClick={() => (window.location.href = '/')}
        />
      </div>

      <div className={`navBar-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        {isAuthenticated && username && (
          <div className="username-greeting-mobile">
            Hello, <span className="username">{username}</span>
          </div>
        )}

        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/Bmi">BMI Calculator</a></li>
          <li><a href="/mealplan">Meal Plan</a></li>
          {isAuthenticated ? (
            <>
              <li><a href="/userProfile">Profile</a></li>
              <li><button className="logout-button"onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <li><a href="/login">Login</a></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;