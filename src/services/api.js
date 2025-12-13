// src/services/api.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';
// 1. Create an axios instance
const api = axios.create({
  //baseURL: 'http://127.0.0.1:8000/api/v1', // Your API base URL
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add a Request Interceptor (Attach Token to every request)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Add a Response Interceptor (Handle 401 Errors)
api.interceptors.response.use(
  (response) => response, // Return success responses directly
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request so we don't loop infinitely

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        // If no refresh token, we can't do anything -> logout
        if (!refreshToken) {
            throw new Error("No refresh token");
        }

        // 4. Call the Backend to Refresh the Token
        const response = await axios.post('http://127.0.0.1:8000/api/v1/token/refresh/', {
          refresh: refreshToken,
        });

        // 5. Save the NEW access token
        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);

        // 6. Update the header of the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 7. Retry the original request
        return api(originalRequest);

      } catch (refreshError) {
        // 8. If Refresh Fails (token expired or invalid) -> Force Logout
        console.error("Session expired. Logging out...", refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;