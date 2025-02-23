import React, { useState } from 'react';
import '../styles/NavBar.css';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
        />
      </div>

      <div className={`navBar-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/Bmi">Bmi Calculator</a></li>
          <li><a href="/mealplan">Meal Plan</a></li>
          <li><a href="/Login">Login Page</a></li>
          <li><a href="/userProfile">Profile</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;