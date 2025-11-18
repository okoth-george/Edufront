import axios from 'axios';

const API_URL = 'http://localhost:5000/api/applications'; // Replace with your backend URL

export const applicationService = {
  // Apply for scholarship (Student only)
  applyForScholarship: async (scholarshipId, applicationData) => {
    try {
      const response = await axios.post(`${API_URL}/${scholarshipId}`, applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit application' };
    }
  },

  // Get student's applications
  getMyApplications: async () => {
    try {
      const response = await axios.get(`${API_URL}/my-applications`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch applications' };
    }
  },

  // Get applications for sponsor's scholarships
  getSponsorApplications: async () => {
    try {
      const response = await axios.get(`${API_URL}/sponsor/applications`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch applications' };
    }
  },

  // Get applications for specific scholarship
  getScholarshipApplications: async (scholarshipId) => {
    try {
      const response = await axios.get(`${API_URL}/scholarship/${scholarshipId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch applications' };
    }
  },

  // Update application status (Sponsor only)
  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await axios.patch(`${API_URL}/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update status' };
    }
  },

  // Get single application details
  getApplicationById: async (applicationId) => {
    try {
      const response = await axios.get(`${API_URL}/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch application' };
    }
  },
};
