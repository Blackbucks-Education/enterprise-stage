// utils.ts
export const getHackathonIdFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
};

// types.ts
export interface FilterOptions {
  degrees: string[];
  branches: string[];
  years: string[];
  employabilityBands: string[];
  bestEmployabilityBands: string[];
}

export interface EmpBandData {
  // Define the structure of the data returned by emp_band_data API
  // e.g. if each entry contains specific fields, add them here
  id: number;
  bandName: string;
  [key: string]: any; // To handle any additional properties
}

// services/api.ts
export const fetchFilterOptions = async (hackathonId: string): Promise<FilterOptions> => {
  try {
    const responses = await Promise.all([
      fetch(`/api/assessment_student_results/filters/degrees/${hackathonId}`),
      fetch(`/api/assessment_student_results/filters/branches/${hackathonId}`),
      fetch(`/api/assessment_student_results/filters/years/${hackathonId}`),
      fetch(`/api/assessment_student_results/filters/employabilityBands/${hackathonId}`),
      fetch(`/api/assessment_student_results/filters/possibleEmployabilityBands/${hackathonId}`),
    ]);

    const filterOptions = await Promise.all(responses.map((res) => res.json()));

    return {
      degrees: Array.isArray(filterOptions[0]) ? filterOptions[0].filter(option => option !== null) : [],
      branches: Array.isArray(filterOptions[1]) ? filterOptions[1].filter(option => option !== null) : [],
      years: Array.isArray(filterOptions[2]) ? filterOptions[2].filter(option => option !== null) : [],
      employabilityBands: Array.isArray(filterOptions[3]) ? filterOptions[3].filter(option => option !== null) : [],
      bestEmployabilityBands: Array.isArray(filterOptions[4]) ? filterOptions[4].filter(option => option !== null) : [],
    };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return {
      degrees: [],
      branches: [],
      years: [],
      employabilityBands: [],
      bestEmployabilityBands: [],
    };
  }
};




export const fetchDataAndPopulateTable = async (hackathonId: string, queryParams: string): Promise<EmpBandData[]> => {
  const response = await fetch(`/api/assessment_student_results/emp_band_data/${hackathonId}${queryParams}`);
  const data: EmpBandData[] = await response.json();
  console.log("API Response:", data); // Log API response structure

  // Filter out any entries that contain null values in the data
  const filteredData = data.filter(item => item !== null);
  
  // Optionally, log the filtered data for debugging
  console.log("Filtered Employment Band Data:", filteredData);

  return filteredData;
};

