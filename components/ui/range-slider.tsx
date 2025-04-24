import React, { useState } from 'react';
import '../../app/employabilityStudentsResults/studentResults.css'; // Import the custom CSS

const CustomSlider = ({ name, value, handleSliderChange }) => {
  const [sliderValue, setSliderValue] = useState(value || 0); // Initialize with the passed value

  const handleSliderChangeLocal = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value)); // Clamp value between 0 and 100
    setSliderValue(value);
    handleSliderChange({ target: { name, value } }); // Pass the name and updated value to the parent
  };

  const handleInputChange = (e) => {
    const value = Math.max(0, Math.min(100, Number(e.target.value))); // Clamp value between 0 and 100
    setSliderValue(value);
    handleSliderChange({ target: { name, value } }); // Pass the name and updated value to the parent
  };

  return (
    <div className="slider-container">
      <p className="slider-label">{name}</p>
      <div className="css-8atqhb">
        <div className="slider">
          <div className="slider-input">
            <input
              type="text"
              value={sliderValue}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="input-box"
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "ArrowDown" || e.key === "ArrowLeft") {
                  e.preventDefault(); // Prevent negative values and down/left arrow key presses
                }
              }}
            />
            <p className="p">%</p>
          </div>

          {/* Slider wrapper */}
          <div
            tabIndex={-1}
            className="slider-wrapper"
            style={{
              position: "relative",
              touchAction: "none",
              userSelect: "none",
              outline: 0,
              paddingTop: "7px",
              paddingBottom: "7px",
              WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
            }}
          >
            {/* Slider track */}
            <div
              className="chakra-slider__track css-55n26k"
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                width: "100%",
              }}
            >
              <div
                className="chakra-slider__filled-track css-4riw5m"
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: `${sliderValue}%`,
                  left: 0,
                }}
              />
            </div>

            {/* Slider input */}
            <input
              type="range"
              value={sliderValue}
              onChange={handleSliderChangeLocal}
              min="0"
              max="100"
              className="range-slider"
              style={{
                position: "absolute",
                width: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2, // Ensures that the slider is interactable
                background: `linear-gradient(to right, #7a62bd ${sliderValue}%, #fff ${sliderValue}%)`,
              }}
            />

            {/* Slider thumb */}
            <div
              role="slider"
              tabIndex={0}
              id="slider-thumb"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={sliderValue}
              aria-orientation="horizontal"
              aria-label="customSlider"
              className="chakra-slider__thumb css-12m3ufn"
              style={{
                position: "absolute",
                userSelect: "none",
                touchAction: "none",
                left: `calc(${sliderValue}% - 7px)`, // Adjusting for thumb size
              }}
            />
          </div>

          {/* Slider range labels */}
          <p className="p100">100%</p>
        </div>
        <p className="min">Enter min</p>
      </div>
    </div>
  );
};

export default CustomSlider;
