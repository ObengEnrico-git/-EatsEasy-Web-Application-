// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BmiCalculator from './pages/BmiCalculator';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BmiCalculator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
