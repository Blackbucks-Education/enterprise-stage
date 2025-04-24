import React, { useState, useEffect, useRef } from "react";
import "../../app/employabilityStudentsResults/studentResults.css"; // Import the custom CSS

const ButtonGroup = ({ options, name, handleChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null); // Ref to detect outside click

  // Handle when an option is clicked
  const handleSelectOption = (option) => {
    if (selectedOptions.includes(option)) {
      handleRemoveOption(option);
    } else {
      setSelectedOptions((prevSelected) => {
        const newSelected = [...prevSelected, option];
        console.log(`Option added: ${option}`);
        console.log("Current selected options:", newSelected);
        handleChange(newSelected, name); // Pass selected options and name
        return newSelected;
      });
    }
  };

  const handleRemoveOption = (option) => {
    setSelectedOptions((prevSelected) => {
      const newSelected = prevSelected.filter((item) => item !== option);
      console.log(`Option removed: ${option}`);
      console.log("Current selected options:", newSelected);
      handleChange(newSelected, name); // Pass selected options and name
      return newSelected;
    });
  };

  // Toggle the visibility of the options
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false); // Close dropdown
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter out the options that are already selected
  const filteredOptions = options.filter(
    (option) => !selectedOptions.includes(option)
  );

  return (
    <div className="checkbox-container" ref={dropdownRef}>
      {/* Selected options display */}
      <div className="selected-options">
        {selectedOptions.map((option) => (
          <div key={option} className="selected-option">
            <span>{option}</span>
            <button
              onClick={() => handleRemoveOption(option)}
              className="remove-btn"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Add more button */}
      <button type="button" onClick={toggleOptions} className="add-more-btn">
        + Add more
      </button>

      {/* Options dropdown (visible when Add more is clicked) */}
      {showOptions && (
        <div className="options-dropdown">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div key={option} onClick={() => handleSelectOption(option)}>
                <label>{option}</label>
                <div className="hr1"></div>
              </div>
            ))
          ) : (
            <p>No more options available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ButtonGroup;
