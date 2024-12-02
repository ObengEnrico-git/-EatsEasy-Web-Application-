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
        <div className="logo">
          EatsEasy
        </div>
        <div className="hamburger-container" onClick={toggleMenu}>
          <div className="hamburger">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      </div>
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="home">Home</a></li>
          <li><a href="/">Bmi Calculator</a></li>
          <li><a href="mealplan">Meal Plan</a></li>
          <li><a href="LoginPage">Login Page</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
