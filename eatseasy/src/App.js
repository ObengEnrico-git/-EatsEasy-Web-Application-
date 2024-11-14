import React from 'react';
<<<<<<< HEAD
import BmiCalculator from './BmiCalculator';
import LoginPage from './LoginPage'; // Ensure this matches the exact name and path
=======
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BmiCalculator from './pages/BmiCalculator';
>>>>>>> 9a146520cce8a1f0accdeddbbac384551d42cdea
import './App.css';


function App() {
  return (
<<<<<<< HEAD
    <div className="App">
     
      <BmiCalculator />
    </div>
=======
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BmiCalculator />} />
        </Routes>
      </div>
    </Router>
>>>>>>> 9a146520cce8a1f0accdeddbbac384551d42cdea
  );
}


export default App;
