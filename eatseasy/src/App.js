import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import './App.css';

// Lazy loading (only loads the requried import for that time imporves performance)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const BmiCalculator = lazy(() => import('./pages/BmiCalculator'));
const MealPlan = lazy(() => import('./pages/MealPlan'));
const LoginPage = lazy(() => import('./pages/userAuthentication/LoginPage'));
const Signup = lazy(() => import('./pages/userAuthentication/Signup'));
const UserProfile = lazy(() => import('./pages/userProfile/UserProfile'));
const Loader = lazy(() => import('./pages/Loader')); //loading screen in between pages
const SavedMealPlan = lazy(() => import('./pages/userProfile/SavedMealPlan'));

import axios from 'axios';

//axios
axios.defaults.withCredentials = true;

function App() {

  return (
    <Router>
      <div className="App">
        <Suspense fallback={<div > <Loader/></div>}> 
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Bmi" element={<BmiCalculator />} />
            <Route path="/mealplan" element={<MealPlan />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/saved-mealplan" element={<SavedMealPlan />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
