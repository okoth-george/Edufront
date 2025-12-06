import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/auth'; // Replace with your backend URL

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login/`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      // Normalize server/client errors to an Error with a useful message
      const serverData = error.response?.data;
      // Handle Django REST Framework style non_field_errors which often indicate
      // invalid credentials: { non_field_errors: ["Unable to log in with provided credentials."] }
      if (serverData && serverData.non_field_errors && Array.isArray(serverData.non_field_errors) && serverData.non_field_errors.length > 0) {
        // Present a simpler, user-friendly message
        throw new Error('Invalid email or password');
      }

      let message = 'Login failed';
      if (serverData) {
        if (typeof serverData === 'string') message = serverData;
        else if (serverData.message) message = serverData.message;
        else if (serverData.detail) message = serverData.detail;
        else message = JSON.stringify(serverData);
      } else if (error.message) {
        message = error.message;
      }
      throw new Error(message);
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register/`, userData);
      return response.data;
    } catch (error) {
      const serverData = error.response?.data;
      let message = 'Registration failed';
      if (serverData) {
        if (typeof serverData === 'string') message = serverData;
        else if (serverData.message) message = serverData.message;
        else if (serverData.detail) message = serverData.detail;
        else message = JSON.stringify(serverData);
      } else if (error.message) {
        message = error.message;
      }
      throw new Error(message);
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password/`, { email });
      return response.data;
    } catch (error) {
      const serverData = error.response?.data;
      let message = 'Request failed';
      if (serverData) {
        if (typeof serverData === 'string') message = serverData;
        else if (serverData.message) message = serverData.message;
        else if (serverData.detail) message = serverData.detail;
        else message = JSON.stringify(serverData);
      } else if (error.message) {
        message = error.message;
      }
      throw new Error(message);
    }
  },

  resetPassword: async (payloadOrToken, new_password,confirm_password) => {
    try {
      // Accept either an object payload { uid, token, email, newPassword, confirm_password }
      // or (token, newPassword) arguments for backward compatibility
      const body = (payloadOrToken && typeof payloadOrToken === 'object' && !Array.isArray(payloadOrToken))
        ? payloadOrToken
        : { token: payloadOrToken, new_password ,confirm_password};

      const response = await axios.post(`${API_URL}/confirm-password/`, body);
      return response.data;
    } catch (error) {
      const serverData = error.response?.data;
      let message = 'Reset failed';
      if (serverData) {
        if (typeof serverData === 'string') message = serverData;
        else if (serverData.message) message = serverData.message;
        else if (serverData.detail) message = serverData.detail;
        else message = JSON.stringify(serverData);
      } else if (error.message) {
        message = error.message;
      }
      throw new Error(message);
    }
  },


  createProfile: async (profileData) => {
    try {
      // 1. Get the token (checking all possible storage keys)
      const token =
        localStorage.getItem('access_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('auth_token');

      // 2. Make the POST request
      // Note: We use the same URL as the GET request, but the method is POST
      const response = await axios.post(
        'http://127.0.0.1:8000/api/v1/sponsors/sponsor/profile/create/', 
        profileData, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' // Good practice for POST requests
          },
        }
      );

      return response.data;
    } catch (error) {
      // 3. Standardized Error Handling (Same as your other functions)
      const serverData = error.response?.data;
      let message = 'Failed to create profile';
      
      if (serverData) {
        if (typeof serverData === 'string') message = serverData;
        else if (serverData.message) message = serverData.message;
        else if (serverData.detail) message = serverData.detail;
        else message = JSON.stringify(serverData);
      } else if (error.message) {
        message = error.message;
      }
      
      throw new Error(message);
    }
  },

  getProfile: async () => {
    try {
      // Support multiple token key names to be tolerant of different backends
      const token =
        localStorage.getItem('access_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('auth_token');
        /*
      const response = await axios.get(`${API_URL}/sponsor/profile/create/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      */
      
      const response = await axios.get('http://127.0.0.1:8000/api/v1/sponsors/sponsor/profile/me/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      const serverData = error.response?.data;
      let message = 'Failed to fetch profile';
      if (serverData) {
        if (typeof serverData === 'string') message = serverData;
        else if (serverData.message) message = serverData.message;
        else if (serverData.detail) message = serverData.detail;
        else message = JSON.stringify(serverData);
      } else if (error.message) {
        message = error.message;
      }
      throw new Error(message);
    }
  },



  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token') || localStorage.getItem('auth_token');
      /*
      const response = await axios.put(`${API_URL}/profile/`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });*/
      const response = await axios.put('http://127.0.0.1:8000/api/v1/sponsors/sponsor/profile/me/', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      const serverData = error.response?.data;
      let message = 'Failed to update profile';
      if (serverData) {
        if (typeof serverData === 'string') message = serverData;
        else if (serverData.message) message = serverData.message;
        else if (serverData.detail) message = serverData.detail;
        else message = JSON.stringify(serverData);
      } else if (error.message) {
        message = error.message;
      }
      throw new Error(message);
    }
  },
};

