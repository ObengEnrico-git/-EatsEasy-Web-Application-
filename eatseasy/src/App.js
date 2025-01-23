import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BmiCalculator from './pages/BmiCalculator'; 
  import MultiStepForm from './pages/multiStep.js'; 
import FloatingLabelForm from './pages/components/componentStyles/testing.js'; 
  import Form from './pages/MainForm.js'; 
          
//import MealPlan from './pages/MealPlan'; <Route path="/mealplan" element={<MealPlan/> } />
//import Form  from './pages/components/form.js';  <Route path="/form" element={<Form/> } />
//import WeightInput from './pages/radio.js'; <Route path="/weightinput" element={<WeightInput/>} />
import './App.css';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BmiCalculator />} />
          <Route path="/testing" element={<FloatingLabelForm />} />
             <Route path="/Form" element={<Form />} />
            <Route path="/multiStep" element={<MultiStepForm/> } />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
     