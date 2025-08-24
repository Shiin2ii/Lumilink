

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import { supabase } from '../config/supabase';




const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const AUTH_ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_CLEAR_ERROR: 'AUTH_CLEAR_ERROR',
  AUTH_UPDATE_USER: 'AUTH_UPDATE_USER'
};



/**
 * Authentication reducer with MCP Sequential Steps:
 * 1. Log action type
 * 2. Validate action payload
 * 3. Update state sequentially
 * 4. Return new state
 */
const authReducer = (state, action) => {
  
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
      
    case AUTH_ACTIONS.AUTH_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
      
    case AUTH_ACTIONS.AUTH_LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
      
    case AUTH_ACTIONS.AUTH_CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case AUTH_ACTIONS.AUTH_UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
      
    default:
      console.warn(`⚠️ [MCP-AUTH] Unknown action type: ${action.type}`);
      return state;
  }
};



const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  /**
   * Initialize authentication state
   * MCP Sequential Steps:
   * 1. Check for stored token
   * 2. Validate token with server
   * 3. Update authentication state
   * 4. Handle initialization errors
   */
  useEffect(() => {
    const initializeAuth = async () => {
     

      try {
        // Step 1: Check for stored token
        const storedToken = localStorage.getItem('lumilink_token');
        const storedUser = localStorage.getItem('lumilink_user');

        if (!storedToken || !storedUser) {
         
          dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: null });
          return;
        }

        // Step 2: Parse stored user data
        const userData = JSON.parse(storedUser);

        // Step 3: Validate token with server
        dispatch({ type: AUTH_ACTIONS.AUTH_START });

        try {
          const response = await authAPI.getCurrentUser();

          if (response.success) {
            // Step 4: Update state with validated user data
            dispatch({
              type: AUTH_ACTIONS.AUTH_SUCCESS,
              payload: {
                user: response.user,
                token: storedToken
              }
            });
       
          } else {
            throw new Error('Invalid token');
          }
        } catch (error) {
          // Step 5: Handle token validation failure
          console.warn('⚠️ [MCP-AUTH] Token validation failed, using stored data');
          dispatch({
            type: AUTH_ACTIONS.AUTH_SUCCESS,
            payload: {
              user: userData,
              token: storedToken
            }
          });
        }

      } catch (error) {
        console.error('❌ [MCP-AUTH] Initialization failed:', error);
        dispatch({
          type: AUTH_ACTIONS.AUTH_FAILURE,
          payload: 'Authentication initialization failed'
        });
      }
    };

    initializeAuth();
  }, []);
  
  // =============================================================================
  // MCP STEP 7: AUTHENTICATION ACTIONS
  // =============================================================================
  
  /**
   * Login user
   * MCP Sequential Steps: validate → request → update state → handle errors
   */
  const login = async (credentials) => {

    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });

      const response = await authAPI.login(credentials);

      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.AUTH_SUCCESS,
          payload: {
            user: response.user,
            token: response.token
          }
        });
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ [MCP-AUTH] Login failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: errorMessage
      });
      throw error;
    }
  };
  
  /**
   * Register user
   * MCP Sequential Steps: validate → request → update state → handle errors
   */
  const register = async (userData) => {

    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });

      const response = await authAPI.register(userData);

      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.AUTH_SUCCESS,
          payload: {
            user: response.user,
            token: response.token
          }
        });
        return response;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ [MCP-AUTH] Registration failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: errorMessage
      });
      throw error;
    }
  };
  
  /**
   * Logout user
   * MCP Sequential Steps: request → clear state → clear storage
   */
  const logout = async () => {

    try {
      await authAPI.logout();
      dispatch({ type: AUTH_ACTIONS.AUTH_LOGOUT });
    } catch (error) {
      console.error('❌ [MCP-AUTH] Logout error:', error);
      // Force logout even if API call fails
      dispatch({ type: AUTH_ACTIONS.AUTH_LOGOUT });
    }
  };
  
  /**
   * Clear authentication error
   */
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.AUTH_CLEAR_ERROR });
  };
  
  /**
   * Update user data
   */
  const updateUser = (userData) => {
    dispatch({ 
      type: AUTH_ACTIONS.AUTH_UPDATE_USER, 
      payload: userData 
    });
  };
  
  // =============================================================================
  // MCP STEP 8: CONTEXT VALUE
  // =============================================================================

  const contextValue = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    register,
    logout,
    clearError,
    updateUser
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// =============================================================================
// MCP STEP 9: CUSTOM HOOK
// =============================================================================

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

