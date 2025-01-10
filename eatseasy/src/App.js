import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BmiCalculator from './pages/BmiCalculator';
import MealPlan from './pages/MealPlan';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BmiCalculator />} />
          <Route path="/mealplan" element={<MealPlan/> } />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
