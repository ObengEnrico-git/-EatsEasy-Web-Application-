import React from "react";

const UnitSelector = ({ title = "Choose a Unit", 
  options = [], 
  selectedUnit, 
  onChange 
}) => {
  return (
    <fieldset className="flex flex-col items-center mb-4" aria-labelledby="unit-choice">
      <legend
        id="unit-choice"
        className="text-2xl font-semibold text-gray-900 dark:text-gray-300 mb-4 text-center"
      >
        {title}
      </legend>

      <div className="flex items-center space-x-4 mb-4">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              id={option.value}
              type="radio"
              name="unit"
              value={option.value}
              checked={selectedUnit === option.value}
              onChange={onChange}
              className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 focus:ring-2 
                         focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 
                         dark:bg-gray-700 dark:border-gray-600"
              aria-label={option.label}
            />
            <label htmlFor={option.value} className="text-xl font-medium text-gray-900 dark:text-gray-300">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default UnitSelector;
