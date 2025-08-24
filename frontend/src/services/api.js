/**
 * =============================================================================
 * API CLIENT - MCP SEQUENTIAL THINKING
 * =============================================================================
 * Centralized API client with authentication, error handling, and logging
 * following MCP Sequential Thinking principles
 */

import axios from 'axios';

// =============================================================================
// MCP STEP 1: API CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =============================================================================
// MCP STEP 2: REQUEST INTERCEPTOR
// =============================================================================

/**
 * Request interceptor with MCP Sequential Steps:
 * 1. Log outgoing request
 * 2. Attach authentication token
 * 3. Add request timestamp
 * 4. Return modified request
 */
apiClient.interceptors.request.use(
  (config) => {
    // Step 1: Get auth token from localStorage
    const token = localStorage.getItem('lumilink_token');

    // Step 2: Attach token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Step 3: Add request timestamp
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =============================================================================
// MCP STEP 3: RESPONSE INTERCEPTOR
// =============================================================================

/**
 * Response interceptor with MCP Sequential Steps:
 * 1. Log response details
 * 2. Calculate request duration
 * 3. Handle authentication errors
 * 4. Return response or handle errors
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('lumilink_token');
      localStorage.removeItem('lumilink_user');

      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// =============================================================================
// MCP STEP 4: AUTHENTICATION API
// =============================================================================

export const authAPI = {
  /**
   * Register new user
   * MCP Sequential Steps: validate → request → handle response → store token
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);

      if (response.data.success && response.data.token) {
        localStorage.setItem('lumilink_token', response.data.token);
        localStorage.setItem('lumilink_user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login user
   * MCP Sequential Steps: validate → request → handle response → store token
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem('lumilink_token', response.data.token);
        localStorage.setItem('lumilink_user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   * MCP Sequential Steps: request → clear storage → redirect
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');

      localStorage.removeItem('lumilink_token');
      localStorage.removeItem('lumilink_user');

      return { success: true };
    } catch (error) {
      // Clear storage anyway
      localStorage.removeItem('lumilink_token');
      localStorage.removeItem('lumilink_user');
      throw error;
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check username availability
   */
  checkUsername: async (username) => {
    try {
      const response = await apiClient.post('/auth/check-username', { username });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check email availability
   */
  checkEmail: async (email) => {
    try {
      const response = await apiClient.post('/auth/check-email', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// =============================================================================
// MCP STEP 5: PROFILE API
// =============================================================================

export const profileAPI = {
  /**
   * Get public profile
   */
  getPublicProfile: async (username) => {
    try {
      const response = await apiClient.get(`/profiles/${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update profile
   */
  updateProfile: async (username, profileData) => {
    try {
      const response = await apiClient.put(`/profiles/${username}`, profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get profile analytics
   */
  getProfileAnalytics: async (username) => {
    try {
      const response = await apiClient.get(`/profiles/${username}/analytics`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// =============================================================================
// MCP STEP 6: LINKS API
// =============================================================================

export const linksAPI = {
  /**
   * Get all links
   */
  getLinks: async () => {
    try {
      const response = await apiClient.get('/links');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new link
   */
  createLink: async (linkData) => {
    try {
      const response = await apiClient.post('/links', linkData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update link
   */
  updateLink: async (linkId, linkData) => {
    try {
      const response = await apiClient.put(`/links/${linkId}`, linkData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete link
   */
  deleteLink: async (linkId) => {
    try {
      const response = await apiClient.delete(`/links/${linkId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// =============================================================================
// EXPORTS
// =============================================================================

export default apiClient;
