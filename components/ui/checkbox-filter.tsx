import { useEffect, useState } from "react";
import "../../public/css/shimmer.css";  // Assuming your shimmer styles are here

const FetchableCheckboxGroup = ({ title, name, apiEndpoint, selectedFilters, onFilterChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);  // Add a loading state

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(apiEndpoint);  // Use correct API endpoint
        const data = await response.json();

        // Transform the data into { value, label } format
        const formattedOptions = data.map(band => ({
          value: band,
          label: `Band ${band}`  // Customize label as needed
        }));

        setOptions(formattedOptions);  // Set the transformed data
        setLoading(false);  // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching employability bands:", error);
        setLoading(false);  // Also stop loading on error
      }
    };

    fetchOptions();
  }, [apiEndpoint]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    onFilterChange(value, checked);
  };

  return (
    <div className="fetchable-checkbox-group">
      <p className="checkbox-group-title">{title}</p>
      <div className="checkbox-list">
        {loading ? (
          // Shimmer effect while loading
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="shimmer-wrapper">
                <div className="shimmer-checkbox" />
              </div>
            ))}
          </>
        ) : (
          // Render checkboxes when data is loaded
          options.map((option) => (
            <label key={option.value} className="checkbox-label">
              <input
                type="checkbox"
                value={option.value}
                checked={selectedFilters.includes(option.value)}
                onChange={handleCheckboxChange}
              />
              {option.label}
            </label>
          ))
        )}
      </div>
    </div>
  );
};

export default FetchableCheckboxGroup;
