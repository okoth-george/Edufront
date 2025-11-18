import axios from 'axios';

const API_URL = 'http://localhost:5000/api/scholarships'; // Replace with your backend URL

// Axios interceptor for adding token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const scholarshipService = {
  // Get all scholarships
  getAllScholarships: async (filters = {}) => {
    try {
      const response = await axios.get(API_URL, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch scholarships' };
    }
  },

  // Get single scholarship
  getScholarshipById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch scholarship' };
    }
  },

  // Create scholarship (Sponsor only)
  createScholarship: async (scholarshipData) => {
    try {
      const response = await axios.post(API_URL, scholarshipData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create scholarship' };
    }
  },

  // Update scholarship (Sponsor only)
  updateScholarship: async (id, scholarshipData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, scholarshipData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update scholarship' };
    }
  },

  // Delete scholarship (Sponsor only)
  deleteScholarship: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete scholarship' };
    }
  },

  // Get scholarships by sponsor
  getSponsorScholarships: async () => {
    try {
      const response = await axios.get(`${API_URL}/sponsor/my-scholarships`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch scholarships' };
    }
  },

  // Search scholarships
  searchScholarships: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/search`, { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Search failed' };
    }
  },
};
