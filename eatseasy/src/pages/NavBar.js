import React, { useState } from 'react';
import '../styles/NavBar.css';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navBar-hamburger-container" onClick={toggleMenu}>
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
          onClick={() => navigate('/')}
        />
      </div>

      <div className={`navBar-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/Bmi">Bmi Calculator</a></li>
          <li><a href="/mealplan">Meal Plan</a></li>
          <li><a href="/Login">Login</a></li>
          <li><a href="/userProfile">Profile</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
