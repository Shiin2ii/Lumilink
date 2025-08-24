// =============================================================================
// AUTHENTICATION SERVICE
// =============================================================================
// Handle user authentication, registration, and session management

import apiClient from './api';

export const authService = {
  // Register new user
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName
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

  // Login user
  async login(credentials) {
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

  // Logout user
  async logout() {
    try {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('lumilink_token');
      localStorage.removeItem('lumilink_user');
    } catch (error) {
      // Still remove local storage even if API call fails
      localStorage.removeItem('lumilink_token');
      localStorage.removeItem('lumilink_user');
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      if (response.data.success) {
        localStorage.setItem('lumilink_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      if (response.data.success) {
        localStorage.setItem('lumilink_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password: newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await apiClient.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Resend verification email
  async resendVerification(email) {
    try {
      const response = await apiClient.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get stored user
  getStoredUser() {
    try {
      const user = localStorage.getItem('lumilink_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Get stored token
  getStoredToken() {
    return localStorage.getItem('lumilink_token');
  },

  // Check if user is authenticated (DEPRECATED - use AuthContext instead)
  isAuthenticated() {
    console.warn('⚠️ authService.isAuthenticated() is deprecated. Use AuthContext isAuthenticated boolean instead.');
    return !!this.getStoredToken();
  },

  // Check if user is admin (DEPRECATED - use AuthContext instead)
  isAdmin() {
    console.warn('⚠️ authService.isAdmin() is deprecated. Use AuthContext user.role instead.');
    const user = this.getStoredUser();
    return user?.role === 'admin' || user?.email === 'admin@lumilink.vn';
  },

  // Check if user is pro (DEPRECATED - use AuthContext instead)
  isPro() {
    console.warn('⚠️ authService.isPro() is deprecated. Use AuthContext user.plan instead.');
    const user = this.getStoredUser();
    return user?.role === 'user_pro' || user?.role === 'admin';
  },

  // Clear all auth data
  clearAuth() {
    localStorage.removeItem('lumilink_token');
    localStorage.removeItem('lumilink_user');
  }
};

export default authService;
