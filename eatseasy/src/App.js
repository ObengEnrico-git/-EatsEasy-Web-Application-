import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BmiCalculator from './pages/BmiCalculator';
import MealPlan from './pages/MealPlan';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/userAuthentication/LoginPage';
import Signup from './pages/userAuthentication/Signup';
import UserProfile from './pages/userProfile/UserProfile';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Bmi" element={<BmiCalculator />} />
          <Route path="/mealplan" element={<MealPlan />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userprofile" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
