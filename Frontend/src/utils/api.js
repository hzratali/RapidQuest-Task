import axios from "axios";

export const fetchData = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}${endpoint}`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
