// services/api.ts

export const fetchHackathons = async (): Promise<any[]> => {
    try {
      const response = await fetch('/api/compare/hackathons');
      if (!response.ok) throw new Error('Failed to fetch hackathons');
      const data = await response.json();
      return data.map((item: any) => ({
        value: item.id,
        label: item.title
      }));
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      return []; // Default to an empty array on error
    }
  };
  

  // services/api.js
export const fetchFilterOptions = async () => {
  const responses = await Promise.all([
    fetch("/api/emp_results_with_filters/filters/degrees"),
    fetch("/api/emp_results_with_filters/filters/branches"),
    fetch("/api/emp_results_with_filters/filters/years"),
    fetch("/api/emp_results_with_filters/filters/employabilityBands"),
    fetch("/api/emp_results_with_filters/filters/possibleEmployabilityBands"),
  ]);

  const filterOptions = await Promise.all(responses.map((res) => res.json()));

  // Filter out null values from each category
  return {
    degrees: filterOptions[0].filter(option => option !== null), // Filter null from degrees
    branches: filterOptions[1].filter(option => option !== null), // Filter null from branches
    years: filterOptions[2].filter(option => option !== null),    // Filter null from years
    employabilityBands: filterOptions[3].filter(option => option !== null), // Filter null from employabilityBands
    bestEmployabilityBands: filterOptions[4].filter(option => option !== null), // Filter null from bestEmployabilityBands
  };
};



export const fetchDataAndPopulateTable = async (queryParams) => {
  const response = await fetch(`/api/emp_results_with_filters/emp_band_data${queryParams}`);
  const data = await response.json();

  // Filter out any entries that contain null values in the rows (if applicable)
  return data.filter(item => item !== null);
};

