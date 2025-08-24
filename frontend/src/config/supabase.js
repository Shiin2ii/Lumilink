/**
 * =============================================================================
 * SUPABASE CLIENT CONFIGURATION (TEMPORARY FALLBACK)
 * =============================================================================
 * Temporary fallback for testing without Supabase package
 * TODO: Replace with real Supabase client after rebuilding Docker
 */

// Temporary mock Supabase client for testing
const mockSupabaseClient = {
  auth: {
    signInWithPassword: async ({ email, password }) => {

      // Mock successful authentication
      return {
        data: {
          user: {
            id: 'mock-user-id-' + Date.now(),
            email: email,
            email_confirmed_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token'
          }
        },
        error: null
      };
    },

    signUp: async ({ email, password, options }) => {

      // Mock successful registration
      return {
        data: {
          user: {
            id: 'mock-user-id-' + Date.now(),
            email: email,
            email_confirmed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            user_metadata: options?.data || {}
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token'
          }
        },
        error: null
      };
    },

    signOut: async () => {
      return { error: null };
    },

    getSession: async () => {

      // Check if we have a mock session
      const mockSession = localStorage.getItem('mock_supabase_session');
      if (mockSession) {
        return {
          data: { session: JSON.parse(mockSession) },
          error: null
        };
      }

      return {
        data: { session: null },
        error: null
      };
    },

    onAuthStateChange: (callback) => {

      // Return mock subscription
      return {
        data: {
          subscription: {
            unsubscribe: () => {
            }
          }
        }
      };
    }
  }
};


export const supabase = mockSupabaseClient;
export default mockSupabaseClient;
