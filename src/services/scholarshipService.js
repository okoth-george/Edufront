import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/sponsors'; // Replace with your backend URL

// Axios interceptor for adding token
axios.interceptors.request.use(
  (config) => {
    // Check for access_token first (new standard), fall back to token (legacy)
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
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
      
      const response = await axios.get(`${API_URL}/`, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch scholarships' };
    }
  },

  

  getScholarshipById: async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/sponsor/scholarships/${id}/`, config);
      return response.data;
    } catch (error) {
      throw error; // Let the component handle the error
    }
  },

  // Create scholarship (Sponsor only)
  createScholarship: async (scholarshipData) => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      
      // Only add Authorization header if token exists (avoid "Bearer undefined")
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(`${API_URL}/scholarship/`, scholarshipData, { headers });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create scholarship' };
    }
  },

  // Update scholarship (Sponsor only)
  /*
  updateScholarship: async (id, scholarshipData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, scholarshipData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update scholarship' };
    }
  },
  */

  updateScholarship: async (id, data) => {
    try {
      const token = localStorage.getItem('access_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // usually PUT or PATCH
      const response = await axios.put(`${API_URL}/sponsor/scholarships/${id}/`, data, config);
      return response.data;
    } catch (error) {
      throw error;
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
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');

      // Only add Authorization header if token exists (avoid "Bearer undefined")
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      // Make request with proper axios.get signature: (url, config)
      const response = await axios.get(`${API_URL}/sponsor/my-scholarships/`, config);
      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[scholarshipService] getSponsorScholarships error', error.response?.status, error.response?.data);
      const msg = error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch scholarships';
      throw new Error(msg);
    }
  },

  // Search scholarships
  searchScholarships: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/search/`, { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Search failed' };
    }
  },
};
