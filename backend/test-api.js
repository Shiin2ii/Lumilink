/**
 * =============================================================================
 * LUMILINK API COMPREHENSIVE TESTING SCRIPT
 * =============================================================================
 * Exploratory Testing Script for LumiLink Backend API
 *
 * Features Tested:
 * • User Management & Access Control (Register/Login, JWT, RBAC)
 * • Profile & Link Management (CRUD links, Public profiles)
 * • File Upload (Avatar/Background with MIME/size validation)
 * • Basic API (GET /api/v1, Health check, Swagger UI)
 * • Advanced UI Testing: Accessibility, Responsive design
 *
 * @author LumiLink Development Team
 * @version 2.0.0
 * @date 2025-08-23
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// =============================================================================
// CONFIGURATION & CONSTANTS
// =============================================================================

const BASE_URL = 'http://localhost:3001';
const API_BASE = `${BASE_URL}/api/v1`;

// Test users for different scenarios (using existing accounts)
const testUsers = {
  admin: {
    email: 'admin@lumilink.site',
    password: 'admin1234',
    role: 'admin',
    displayName: 'Admin User',
    description: 'Administrator account for testing admin features'
  },
  free: {
    email: 'userfree@lumilink.site',
    password: 'User@123',
    role: 'user_free',
    displayName: 'Free User',
    description: 'Free tier user for testing basic features'
  },
  premium: {
    email: 'userpremium@lumilink.site',
    password: 'User@123',
    role: 'user_premium',
    displayName: 'Premium User',
    description: 'Premium user for testing advanced features'
  },
  // Fallback test user for registration tests
  newUser: {
    username: 'test' + Date.now().toString().slice(-6), // Chỉ lấy 6 số cuối để username ngắn hơn
    email: `test${Date.now()}@test.com`, // Email ngắn hơn
    password: 'Pass123!',
    displayName: 'Test User',
    bio: 'Test user for API testing'
  }
};

// Test data storage
let authTokens = {};
let testData = {
  users: {},
  links: [],
  profiles: {},
  uploadedFiles: []
};

// Test statistics
let testStats = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  startTime: null,
  endTime: null
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Enhanced request helper with better error handling and logging
async function makeRequest(method, url, data = null, headers = {}, options = {}) {
  const startTime = Date.now();

  try {
    const config = {
      method: method.toUpperCase(),
      url: url.startsWith('http') ? url : `${API_BASE}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: options.timeout || 10000,
      validateStatus: () => true // Don't throw on HTTP error status
    };

    if (data) {
      if (data instanceof FormData) {
        config.data = data;
        delete config.headers['Content-Type']; // Let axios set it for FormData
      } else {
        config.data = data;
      }
    }

    const response = await axios(config);
    const duration = Date.now() - startTime;

    // Log request details if verbose mode
    if (options.verbose) {
      console.log(`📡 ${method.toUpperCase()} ${config.url} - ${response.status} (${duration}ms)`);
    }

    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
      status: response.status,
      headers: response.headers,
      duration
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 0,
      duration,
      networkError: !error.response
    };
  }
}

// Test result logging
function logTest(testName, success, details = '', duration = 0) {
  testStats.total++;

  if (success) {
    testStats.passed++;
    console.log(`✅ ${testName} ${details ? `- ${details}` : ''} (${duration}ms)`);
  } else {
    testStats.failed++;
    console.log(`❌ ${testName} ${details ? `- ${details}` : ''} (${duration}ms)`);
  }
}

// Skip test logging
function skipTest(testName, reason) {
  testStats.skipped++;
  console.log(`⏭️  ${testName} - SKIPPED: ${reason}`);
}

// Create test file for upload testing
function createTestFile(filename, content = 'Test file content', mimeType = 'text/plain') {
  const filePath = path.join(__dirname, 'temp', filename);

  // Ensure temp directory exists
  const tempDir = path.dirname(filePath);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  fs.writeFileSync(filePath, content);
  return filePath;
}

// Clean up test files
function cleanupTestFiles() {
  const tempDir = path.join(__dirname, 'temp');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

// =============================================================================
// BASIC API & HEALTH CHECK TESTS
// =============================================================================

async function testBasicApiEndpoint() {
  console.log('\n🔍 Testing basic API endpoint...');
  const result = await makeRequest('GET', '', null, {}, { verbose: true });

  if (result.success) {
    logTest('Basic API Endpoint', true, `Available endpoints: ${Object.keys(result.data.endpoints || {}).length}`, result.duration);
    console.log('📋 Available endpoints:', Object.keys(result.data.endpoints || {}));
    console.log('📄 API Version:', result.data.version);
    console.log('📚 Documentation:', result.data.documentation);
  } else {
    logTest('Basic API Endpoint', false, `Status: ${result.status}`, result.duration);
    console.log('❌ Error:', result.error);
  }

  return result.success;
}

async function testHealthCheck() {
  console.log('\n🔍 Testing health check endpoint...');
  // Health endpoint is at root level, not under /api/v1
  const result = await makeRequest('GET', `${BASE_URL}/health`, null, {}, { verbose: true });

  if (result.success) {
    logTest('Health Check', true, `Status: ${result.data.status}, Uptime: ${Math.round(result.data.uptime)}s`, result.duration);
    console.log('📊 Server Status:', result.data.status);
    console.log('⏱️  Uptime:', Math.round(result.data.uptime), 'seconds');
    console.log('🕐 Timestamp:', result.data.timestamp);
  } else {
    logTest('Health Check', false, `Status: ${result.status}`, result.duration);
    console.log('❌ Error:', result.error);
  }

  return result.success;
}

async function testSwaggerDocumentation() {
  console.log('\n🔍 Testing Swagger documentation...');
  const result = await makeRequest('GET', `${BASE_URL}/api-docs`, null, {}, { verbose: true });

  if (result.success) {
    logTest('Swagger Documentation', true, 'Documentation accessible', result.duration);
    console.log('📚 Swagger UI is accessible');
  } else {
    logTest('Swagger Documentation', false, `Status: ${result.status}`, result.duration);
    console.log('❌ Swagger documentation not accessible:', result.error);
  }

  return result.success;
}

// =============================================================================
// USER MANAGEMENT & AUTHENTICATION TESTS
// =============================================================================

async function testUserRegistration() {
  console.log('\n🔍 Testing user registration (new user)...');
  const userData = testUsers.newUser;
  const result = await makeRequest('POST', '/auth/register', userData, {}, { verbose: true });

  if (result.success) {
    authTokens.newUser = result.data.token;
    testData.users.newUser = result.data.user;
    logTest('User Registration', true, `User: ${userData.username}`, result.duration);
    console.log('👤 User ID:', result.data.user?.id);
    console.log('🔑 Auth token received');
  } else {
    logTest('User Registration', false, `Status: ${result.status} - ${JSON.stringify(result.error)}`, result.duration);
    console.log('❌ Registration Error Details:', result.error);
    console.log('📝 Sent Data:', JSON.stringify(userData, null, 2));
  }

  return result.success;
}

async function testAdminLogin() {
  console.log('\n🔍 Testing admin login...');
  const loginData = {
    email: testUsers.admin.email,
    password: testUsers.admin.password
  };

  const result = await makeRequest('POST', '/auth/login', loginData, {}, { verbose: true });

  if (result.success) {
    authTokens.admin = result.data.token;
    testData.users.admin = result.data.user;
    logTest('Admin Login', true, `Admin: ${testUsers.admin.email}`, result.duration);
    console.log('🔑 Admin token received');
    console.log('👑 Role:', result.data.user?.role || 'Not specified');
  } else {
    logTest('Admin Login', false, `Status: ${result.status} - ${result.error?.message || result.error}`, result.duration);
  }

  return result.success;
}

async function testFreeUserLogin() {
  console.log('\n🔍 Testing free user login...');
  const loginData = {
    email: testUsers.free.email,
    password: testUsers.free.password
  };

  const result = await makeRequest('POST', '/auth/login', loginData, {}, { verbose: true });

  if (result.success) {
    authTokens.free = result.data.token;
    testData.users.free = result.data.user;
    logTest('Free User Login', true, `Free User: ${testUsers.free.email}`, result.duration);
    console.log('🔑 Free user token received');
    console.log('🆓 Role:', result.data.user?.role || 'free');
  } else {
    logTest('Free User Login', false, `Status: ${result.status} - ${result.error?.message || result.error}`, result.duration);
  }

  return result.success;
}

async function testPremiumUserLogin() {
  console.log('\n🔍 Testing premium user login...');
  const loginData = {
    email: testUsers.premium.email,
    password: testUsers.premium.password
  };

  const result = await makeRequest('POST', '/auth/login', loginData, {}, { verbose: true });

  if (result.success) {
    authTokens.premium = result.data.token;
    testData.users.premium = result.data.user;
    logTest('Premium User Login', true, `Premium User: ${testUsers.premium.email}`, result.duration);
    console.log('🔑 Premium user token received');
    console.log('💎 Role:', result.data.user?.role || 'premium');
  } else {
    logTest('Premium User Login', false, `Status: ${result.status} - ${result.error?.message || result.error}`, result.duration);
  }

  return result.success;
}

async function testCurrentUser() {
  if (!authTokens.free) {
    skipTest('Current User Info', 'No free user auth token available');
    return false;
  }

  console.log('\n🔍 Testing current user endpoint...');
  const result = await makeRequest('GET', '/auth/me', null, {
    'Authorization': `Bearer ${authTokens.free}`
  }, { verbose: true });

  if (result.success) {
    logTest('Current User Info', true, `User: ${result.data.user?.email}`, result.duration);
    console.log('👤 Email:', result.data.user?.email);
    console.log('🏷️  Display Name:', result.data.user?.displayName);
    console.log('🔰 Role:', result.data.user?.role || 'Not specified');
  } else {
    logTest('Current User Info', false, `Status: ${result.status} - ${result.error?.message || result.error}`, result.duration);
  }

  return result.success;
}

// =============================================================================
// RBAC (ROLE-BASED ACCESS CONTROL) TESTS
// =============================================================================

async function testAdminAccess() {
  if (!authTokens.admin) {
    skipTest('Admin Access Test', 'No admin token available');
    return false;
  }

  console.log('\n� Testing admin access to admin endpoints...');
  // Use /admin/stats instead of /admin/dashboard (which doesn't exist)
  const result = await makeRequest('GET', '/admin/stats', null, {
    'Authorization': `Bearer ${authTokens.admin}`
  }, { verbose: true });

  if (result.success) {
    logTest('Admin Access', true, 'Admin can access admin endpoints', result.duration);
    console.log('👑 Admin stats accessible');
    console.log('📊 System stats:', Object.keys(result.data.stats || {}));
  } else {
    logTest('Admin Access', false, `Status: ${result.status} - Admin should have access`, result.duration);
  }

  return result.success;
}

async function testFreeUserAdminRestriction() {
  if (!authTokens.free) {
    skipTest('Free User Admin Restriction', 'No free user token available');
    return false;
  }

  console.log('\n🔍 Testing free user restriction from admin endpoints...');
  const result = await makeRequest('GET', '/admin/stats', null, {
    'Authorization': `Bearer ${authTokens.free}`
  }, { verbose: true });

  // Should fail with 403 (Forbidden)
  if (!result.success && (result.status === 403 || result.status === 401)) {
    logTest('Free User Admin Restriction', true, 'Free user correctly blocked from admin', result.duration);
    console.log('🔒 Free user correctly blocked from admin endpoints');
  } else {
    logTest('Free User Admin Restriction', false, 'Free user should be blocked from admin', result.duration);
  }

  return !result.success; // Success means restriction worked
}

async function testPremiumFeatureAccess() {
  if (!authTokens.premium) {
    skipTest('Premium Feature Access', 'No premium user token available');
    return false;
  }

  console.log('\n🔍 Testing premium user access to premium features...');
  // Use /premium/plans instead of /premium/features (which doesn't exist)
  const result = await makeRequest('GET', '/premium/plans', null, {
    'Authorization': `Bearer ${authTokens.premium}`
  }, { verbose: true });

  if (result.success) {
    logTest('Premium Feature Access', true, 'Premium user can access premium endpoints', result.duration);
    console.log('💎 Premium plans accessible');
    console.log('📋 Available plans:', result.data.data?.plans?.length || 0);
  } else {
    logTest('Premium Feature Access', false, `Status: ${result.status} - Premium user should have access`, result.duration);
  }

  return result.success;
}

async function testFreeUserPremiumRestriction() {
  if (!authTokens.free) {
    skipTest('Free User Premium Restriction', 'No free user token available');
    return false;
  }

  console.log('\n🔍 Testing free user access to premium plans...');
  // Test if free user can access premium plans (should be allowed for viewing)
  const result = await makeRequest('GET', '/premium/plans', null, {
    'Authorization': `Bearer ${authTokens.free}`
  }, { verbose: true });

  if (result.success) {
    logTest('Free User Premium Plans Access', true, 'Free user can view premium plans (expected)', result.duration);
    console.log('✅ Free user can view premium plans for upgrade');
  } else {
    logTest('Free User Premium Plans Access', false, `Status: ${result.status}`, result.duration);
  }

  return result.success;
}

async function testUsernameAvailability() {
  console.log('\n🔍 Testing username availability check...');
  // Use a simple, valid username format (3-20 chars, alphanumeric + underscore)
  const testUsername = 'testuser123';
  const requestData = { username: testUsername };

  const result = await makeRequest('POST', '/auth/check-username', requestData, {}, { verbose: true });

  if (result.success) {
    logTest('Username Availability', true, `Username "${testUsername}" is ${result.data.available ? 'available' : 'taken'}`, result.duration);
    console.log('✅ Username availability check working');
    console.log('📝 Response:', result.data.message);
  } else {
    logTest('Username Availability', false, `Status: ${result.status} - ${JSON.stringify(result.error)}`, result.duration);
    console.log('❌ Username check error:', result.error);
    console.log('📝 Sent username:', testUsername);
    console.log('📏 Username length:', testUsername.length);
    console.log('✅ Username format valid:', /^[a-zA-Z0-9_]{3,20}$/.test(testUsername));
  }

  return result.success;
}

async function testEmailAvailability() {
  console.log('\n🔍 Testing email availability check...');
  const testEmail = `available_${Date.now()}@example.com`;
  const requestData = { email: testEmail };

  const result = await makeRequest('POST', '/auth/check-email', requestData, {}, { verbose: true });

  if (result.success) {
    logTest('Email Availability', true, `Email "${testEmail}" is ${result.data.available ? 'available' : 'taken'}`, result.duration);
    console.log('✅ Email availability check working');
    console.log('📝 Response:', result.data.message);
  } else {
    logTest('Email Availability', false, `Status: ${result.status} - ${JSON.stringify(result.error)}`, result.duration);
    console.log('❌ Email check error:', result.error);
  }

  return result.success;
}

// =============================================================================
// PROFILE MANAGEMENT TESTS
// =============================================================================

async function testProfileUpdate() {
  if (!authTokens.free) {
    skipTest('Profile Update', 'No free user auth token available');
    return false;
  }

  console.log('\n� Testing profile update...');
  const profileData = {
    displayName: 'Updated Test User',
    bio: 'Updated bio for testing',
    theme: 'dark',
    customDomain: '',
    isPublic: true
  };

  const result = await makeRequest('PUT', '/profiles/update', profileData, {
    'Authorization': `Bearer ${authTokens.free}`
  }, { verbose: true });

  if (result.success) {
    logTest('Profile Update', true, 'Profile updated successfully', result.duration);
    console.log('� Updated display name:', profileData.displayName);
  } else {
    logTest('Profile Update', false, `Status: ${result.status} - ${result.error?.message || result.error}`, result.duration);
  }

  return result.success;
}

async function testPublicProfile() {
  console.log('\n🔍 Testing public profile access...');
  // Try with actual username from the free user data
  let username = 'userfree'; // Default fallback

  // If we have user data from login, use the actual username
  if (testData.users.free?.username) {
    username = testData.users.free.username;
  }

  const result = await makeRequest('GET', `/profiles/${username}`, null, {}, { verbose: true });

  if (result.success) {
    logTest('Public Profile Access', true, `Profile for ${username}`, result.duration);
    console.log('👤 Profile found for:', result.data.profile?.username);
    console.log('🔗 Links count:', result.data.links?.length || 0);
  } else {
    logTest('Public Profile Access', false, `Status: ${result.status} - Username: ${username}`, result.duration);
  }

  return result.success;
}

// =============================================================================
// LINK MANAGEMENT TESTS (CRUD OPERATIONS)
// =============================================================================

async function testGetUserLinks() {
  if (!authTokens.free) {
    skipTest('Get User Links', 'No free user auth token available');
    return false;
  }

  console.log('\n🔍 Testing get user links...');
  const result = await makeRequest('GET', '/links/me', null, {
    'Authorization': `Bearer ${authTokens.free}`
  }, { verbose: true });

  if (result.success) {
    logTest('Get User Links', true, `Found ${result.data.links?.length || 0} links`, result.duration);
    console.log('🔗 Links count:', result.data.links?.length || 0);
  } else {
    logTest('Get User Links', false, `Status: ${result.status}`, result.duration);
  }

  return result.success;
}

async function testCreateLink() {
  // Use newUser if available, otherwise fallback to free user
  const token = authTokens.newUser || authTokens.free;
  const userType = authTokens.newUser ? 'newUser' : 'free';

  if (!token) {
    skipTest('Create Link', 'No auth token available');
    return false;
  }

  console.log(`\n🔍 Testing create link (${userType})...`);

  // First, let's debug by checking if user has profile
  console.log('🔍 Debug: Checking user profile first...');
  const userResult = await makeRequest('GET', '/auth/me', null, {
    'Authorization': `Bearer ${token}`
  }, { verbose: false });

  if (userResult.success) {
    console.log('👤 User ID:', userResult.data.user?.id);
    console.log('👤 Username:', userResult.data.user?.username);

    // Try to get profile via public profile endpoint (since /profiles/me doesn't exist)
    const username = userResult.data.user?.username;
    if (username) {
      const profileResult = await makeRequest('GET', `/profiles/${username}`, null, {}, { verbose: false });

      if (profileResult.success) {
        console.log('✅ Profile exists for user via public endpoint');
        console.log('📊 Profile ID:', profileResult.data.profile?.id);
      } else {
        console.log('❌ Profile not found via public endpoint:', profileResult.status, profileResult.error);
      }
    }
  }

  const linkData = {
    title: 'Test Website Link',
    url: 'https://example.com',
    description: 'Test link for API testing',
    type: 'website',
    icon: 'website',
    isVisible: true,
    sortOrder: 0
  };

  const result = await makeRequest('POST', '/links', linkData, {
    'Authorization': `Bearer ${token}`
  }, { verbose: true });

  if (result.success) {
    testData.links.push(result.data.link);
    logTest('Create Link', true, `Link ID: ${result.data.link?.id}`, result.duration);
    console.log('🔗 Link created:', result.data.link?.title);
    console.log('📊 Link data:', JSON.stringify(result.data.link, null, 2));
  } else {
    logTest('Create Link', false, `Status: ${result.status} - ${JSON.stringify(result.error)}`, result.duration);
    console.log('❌ Create Link Error Details:', result.error);
    console.log('📝 Sent Data:', JSON.stringify(linkData, null, 2));
    console.log('🔑 Token used:', token ? 'Present' : 'Missing');

    // Debug: Check specific error types
    if (result.status === 404) {
      console.log('🚨 BUG CONFIRMED: Profile not found for user - profile creation may have failed during registration');
    }
    if (result.status === 500) {
      console.log('🚨 BUG CONFIRMED: Server error - check database constraints, validation, or profile_id mapping');
    }
    if (result.status === 400) {
      console.log('🚨 BUG CONFIRMED: Validation error - check required fields or URL format');
    }
  }

  return result.success;
}

async function testUpdateLink() {
  if (!authTokens.free || testData.links.length === 0) {
    skipTest('Update Link', 'No free user auth token or links available');
    return false;
  }

  console.log('\n� Testing update link...');
  const linkId = testData.links[0].id;
  const updateData = {
    title: 'Updated Test Link',
    description: 'Updated description for testing',
    isActive: true
  };

  const result = await makeRequest('PUT', `/links/${linkId}`, updateData, {
    'Authorization': `Bearer ${authTokens.free}`
  }, { verbose: true });

  if (result.success) {
    logTest('Update Link', true, `Updated link: ${updateData.title}`, result.duration);
    console.log('� Link updated successfully');
  } else {
    logTest('Update Link', false, `Status: ${result.status}`, result.duration);
  }

  return result.success;
}

async function testLinkReordering() {
  if (!authTokens.free || testData.links.length === 0) {
    skipTest('Link Reordering', 'No auth token or links available');
    return false;
  }

  console.log('\n🔍 Testing link reordering...');
  const reorderData = {
    linkIds: testData.links.map(link => link.id).reverse()
  };

  const result = await makeRequest('PUT', '/links/reorder', reorderData, {
    'Authorization': `Bearer ${authTokens.free}`
  }, { verbose: true });

  if (result.success) {
    logTest('Link Reordering', true, 'Links reordered successfully', result.duration);
    console.log('🔄 Links reordered');
  } else {
    logTest('Link Reordering', false, `Status: ${result.status}`, result.duration);
  }

  return result.success;
}

async function testDeleteLink() {
  if (!authTokens.free || testData.links.length === 0) {
    skipTest('Delete Link', 'No free user auth token or links available');
    return false;
  }

  console.log('\n🔍 Testing delete link...');
  const linkId = testData.links[0].id;

  const result = await makeRequest('DELETE', `/links/${linkId}`, null, {
    'Authorization': `Bearer ${authTokens.free}`
  }, { verbose: true });

  if (result.success) {
    logTest('Delete Link', true, `Deleted link ID: ${linkId}`, result.duration);
    console.log('🗑️  Link deleted successfully');
  } else {
    logTest('Delete Link', false, `Status: ${result.status}`, result.duration);
  }

  return result.success;
}

// =============================================================================
// FILE UPLOAD TESTS (AVATAR & BACKGROUND)
// =============================================================================

async function testAvatarUpload() {
  // Use newUser if available, otherwise fallback to free user
  const token = authTokens.newUser || authTokens.free;
  const userType = authTokens.newUser ? 'newUser' : 'free';

  if (!token) {
    skipTest('Avatar Upload', 'No auth token available');
    return false;
  }

  console.log(`\n🔍 Testing avatar upload (${userType})...`);

  // Create a test image file
  const testImagePath = createTestFile('test-avatar.jpg', 'fake-image-data', 'image/jpeg');

  try {
    const formData = new FormData();
    formData.append('avatar', fs.createReadStream(testImagePath)); // Đúng field name

    const result = await makeRequest('POST', '/upload/avatar', formData, {
      'Authorization': `Bearer ${token}`
    }, { verbose: true });

    if (result.success) {
      testData.uploadedFiles.push(result.data.filename);
      logTest('Avatar Upload', true, `File: ${result.data.filename}`, result.duration);
      console.log('📁 Avatar uploaded:', result.data.filename);
      console.log('🔗 Avatar URL:', result.data.url);
    } else {
      logTest('Avatar Upload', false, `Status: ${result.status} - ${JSON.stringify(result.error)}`, result.duration);
      console.log('❌ Avatar Upload Error Details:', result.error);
      console.log('📁 File path:', testImagePath);
      console.log('📊 File exists:', fs.existsSync(testImagePath));
      console.log('🔑 Token used:', token ? 'Present' : 'Missing');

      // Try to get more details about the error
      if (result.status === 500) {
        console.log('🚨 Server Error (500) - Possible causes:');
        console.log('   - Multer configuration issue');
        console.log('   - File system permissions');
        console.log('   - Database connection error');
        console.log('   - Missing upload directory');
      }
    }

    return result.success;
  } catch (error) {
    logTest('Avatar Upload', false, `Exception: ${error.message}`, 0);
    console.log('💥 Avatar Upload Exception:', error.message);
    console.log('📁 File path:', testImagePath);
    return false;
  }
}

async function testBackgroundUpload() {
  if (!authTokens.free) {
    skipTest('Background Upload', 'No free user auth token available');
    return false;
  }

  console.log('\n🔍 Testing background upload...');

  // Create a test image file
  const testImagePath = createTestFile('test-background.png', 'fake-background-data', 'image/png');

  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testImagePath));

    const result = await makeRequest('POST', '/upload/background', formData, {
      'Authorization': `Bearer ${authTokens.free}`
    }, { verbose: true });

    if (result.success) {
      testData.uploadedFiles.push(result.data.filename);
      logTest('Background Upload', true, `File: ${result.data.filename}`, result.duration);
      console.log('📁 Background uploaded:', result.data.filename);
      console.log('🔗 Background URL:', result.data.url);
    } else {
      logTest('Background Upload', false, `Status: ${result.status} - ${result.error?.message || result.error}`, result.duration);
    }

    return result.success;
  } catch (error) {
    logTest('Background Upload', false, `Error: ${error.message}`, 0);
    return false;
  }
}

async function testFileUploadValidation() {
  if (!authTokens.free) {
    skipTest('File Upload Validation', 'No free user auth token available');
    return false;
  }

  console.log('\n🔍 Testing file upload validation (invalid file type)...');

  // Create a test file with invalid type
  const testFilePath = createTestFile('test-invalid.txt', 'invalid-file-content', 'text/plain');

  try {
    const formData = new FormData();
    formData.append('avatar', fs.createReadStream(testFilePath)); // Đúng field name cho validation test

    const result = await makeRequest('POST', '/upload/avatar', formData, {
      'Authorization': `Bearer ${authTokens.free}`
    }, { verbose: true });

    // This should fail due to invalid file type
    if (!result.success && result.status === 400) {
      logTest('File Upload Validation', true, 'Correctly rejected invalid file type', result.duration);
      console.log('✅ File validation working correctly');
    } else {
      logTest('File Upload Validation', false, 'Should have rejected invalid file type', result.duration);
    }

    return !result.success; // Success means validation worked (request failed)
  } catch (error) {
    logTest('File Upload Validation', false, `Error: ${error.message}`, 0);
    return false;
  }
}

// Storage info endpoint không tồn tại trong routes - bỏ test này
// async function testStorageInfo() - REMOVED: Endpoint không tồn tại

// =============================================================================
// ANALYTICS & ADVANCED FEATURES TESTS
// =============================================================================

async function testAnalyticsOverview() {
  if (!authTokens.free) {
    skipTest('Analytics Overview', 'No free user auth token available');
    return false;
  }

  console.log('\n🔍 Testing analytics overview...');
  const result = await makeRequest('GET', '/analytics/overview', null, {
    'Authorization': `Bearer ${authTokens.free}`
  }, { verbose: true });

  if (result.success) {
    logTest('Analytics Overview', true, `Profile views: ${result.data.profileViews || 0}`, result.duration);
    console.log('📊 Profile views:', result.data.profileViews || 0);
    console.log('🔗 Total clicks:', result.data.totalClicks || 0);
  } else {
    logTest('Analytics Overview', false, `Status: ${result.status}`, result.duration);
  }

  return result.success;
}

async function testLinksAnalytics() {
  if (!authTokens.free) {
    skipTest('Links Analytics', 'No free user auth token available');
    return false;
  }

  console.log('\n🔍 Testing links analytics...');
  const result = await makeRequest('GET', '/analytics/links', null, {
    'Authorization': `Bearer ${authTokens.free}`
  }, { verbose: true });

  if (result.success) {
    logTest('Links Analytics', true, `Analytics for ${result.data.links?.length || 0} links`, result.duration);
    console.log('📈 Links with analytics:', result.data.links?.length || 0);
  } else {
    logTest('Links Analytics', false, `Status: ${result.status}`, result.duration);
  }

  return result.success;
}

// =============================================================================
// RBAC & SECURITY TESTS
// =============================================================================

async function testUnauthorizedAccess() {
  console.log('\n🔍 Testing unauthorized access protection...');
  const result = await makeRequest('GET', '/links/me', null, {}, { verbose: true });

  // Should fail with 401
  if (!result.success && result.status === 401) {
    logTest('Unauthorized Access Protection', true, 'Correctly blocked unauthorized request', result.duration);
    console.log('🔒 Unauthorized access correctly blocked');
  } else {
    logTest('Unauthorized Access Protection', false, 'Should have blocked unauthorized access', result.duration);
  }

  return !result.success; // Success means protection worked (request failed)
}

async function testInvalidToken() {
  console.log('\n🔍 Testing invalid token handling...');
  const result = await makeRequest('GET', '/auth/me', null, {
    'Authorization': 'Bearer invalid-token-12345'
  }, { verbose: true });

  // Should fail with 401
  if (!result.success && result.status === 401) {
    logTest('Invalid Token Handling', true, 'Correctly rejected invalid token', result.duration);
    console.log('🔒 Invalid token correctly rejected');
  } else {
    logTest('Invalid Token Handling', false, 'Should have rejected invalid token', result.duration);
  }

  return !result.success; // Success means validation worked (request failed)
}

// =============================================================================
// UI & ACCESSIBILITY TESTS (BASIC API CHECKS)
// =============================================================================

async function testResponsiveEndpoints() {
  console.log('\n🔍 Testing responsive design support endpoints...');

  // Test with different user agents to simulate different devices
  const userAgents = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', // Mobile
    'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)', // Tablet
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // Desktop
  ];

  let allPassed = true;

  for (const userAgent of userAgents) {
    const result = await makeRequest('GET', '', null, {
      'User-Agent': userAgent
    }, { verbose: true });

    if (!result.success) {
      allPassed = false;
      break;
    }
  }

  if (allPassed) {
    logTest('Responsive Endpoints', true, 'API responds to all device types', 0);
    console.log('📱 API supports mobile, tablet, and desktop requests');
  } else {
    logTest('Responsive Endpoints', false, 'API failed for some device types', 0);
  }

  return allPassed;
}

async function testCORSHeaders() {
  console.log('\n🔍 Testing CORS headers...');
  const result = await makeRequest('OPTIONS', '', null, {
    'Origin': 'http://localhost:3000',
    'Access-Control-Request-Method': 'GET'
  }, { verbose: true });

  if (result.success || result.headers?.['access-control-allow-origin']) {
    logTest('CORS Headers', true, 'CORS headers present', result.duration);
    console.log('🌐 CORS configured for cross-origin requests');
  } else {
    logTest('CORS Headers', false, 'CORS headers missing', result.duration);
  }

  return result.success || !!result.headers?.['access-control-allow-origin'];
}

// =============================================================================
// PERFORMANCE & LOAD TESTS
// =============================================================================

async function testAPIPerformance() {
  console.log('\n🔍 Testing API performance...');

  const testEndpoints = [
    { method: 'GET', url: '', name: 'Basic API' },
    { method: 'GET', url: '/health', name: 'Health Check' }
  ];

  let totalDuration = 0;
  let testCount = 0;

  for (const endpoint of testEndpoints) {
    const result = await makeRequest(endpoint.method, endpoint.url, null, {}, { verbose: false });
    if (result.success) {
      totalDuration += result.duration;
      testCount++;
    }
  }

  const avgResponseTime = testCount > 0 ? Math.round(totalDuration / testCount) : 0;

  if (avgResponseTime > 0 && avgResponseTime < 1000) { // Less than 1 second
    logTest('API Performance', true, `Avg response time: ${avgResponseTime}ms`, avgResponseTime);
    console.log('⚡ API performance is good');
  } else {
    logTest('API Performance', false, `Avg response time: ${avgResponseTime}ms (too slow)`, avgResponseTime);
  }

  return avgResponseTime > 0 && avgResponseTime < 1000;
}

// =============================================================================
// MAIN TEST RUNNER
// =============================================================================

async function runAllTests() {
  console.log('🚀 Starting LumiLink API Comprehensive Testing...');
  console.log('=' .repeat(80));
  console.log('🌐 Base URL:', BASE_URL);
  console.log('📅 Test Started:', new Date().toISOString());
  console.log('');
  console.log('� Test Accounts (Pre-configured):');
  console.log('   👑 Admin:', testUsers.admin.email, '/ admin1234');
  console.log('   🆓 Free User:', testUsers.free.email, '/ User@123');
  console.log('   💎 Premium User:', testUsers.premium.email, '/ User@123');
  console.log('   🆕 New User:', testUsers.newUser.email, '(for registration test)');
  console.log('=' .repeat(80));

  testStats.startTime = Date.now();

  // Define test suites in execution order
  const testSuites = [
    {
      name: '🔧 Basic API & Infrastructure',
      tests: [
        { name: 'Basic API Endpoint', fn: testBasicApiEndpoint },
        { name: 'Health Check', fn: testHealthCheck },
        { name: 'Swagger Documentation', fn: testSwaggerDocumentation },
        { name: 'API Performance', fn: testAPIPerformance },
        { name: 'CORS Headers', fn: testCORSHeaders },
        { name: 'Responsive Endpoints', fn: testResponsiveEndpoints }
      ]
    },
    {
      name: '🔐 Authentication & Security',
      tests: [
        { name: 'User Registration', fn: testUserRegistration },
        { name: 'Admin Login', fn: testAdminLogin },
        { name: 'Free User Login', fn: testFreeUserLogin },
        { name: 'Premium User Login', fn: testPremiumUserLogin },
        { name: 'Current User Info', fn: testCurrentUser },
        { name: 'Username Availability', fn: testUsernameAvailability },
        { name: 'Email Availability', fn: testEmailAvailability },
        { name: 'Unauthorized Access Protection', fn: testUnauthorizedAccess },
        { name: 'Invalid Token Handling', fn: testInvalidToken }
      ]
    },
    {
      name: '🔐 RBAC & Role-Based Access Control',
      tests: [
        { name: 'Admin Stats Access', fn: testAdminAccess },
        { name: 'Free User Admin Restriction', fn: testFreeUserAdminRestriction },
        { name: 'Premium Plans Access', fn: testPremiumFeatureAccess },
        { name: 'Free User Premium Plans Access', fn: testFreeUserPremiumRestriction }
      ]
    },
    {
      name: '👤 Profile Management',
      tests: [
        { name: 'Profile Update', fn: testProfileUpdate },
        { name: 'Public Profile Access', fn: testPublicProfile }
      ]
    },
    {
      name: '🔗 Link Management (CRUD)',
      tests: [
        { name: 'Get User Links', fn: testGetUserLinks },
        { name: 'Create Link', fn: testCreateLink },
        { name: 'Update Link', fn: testUpdateLink },
        { name: 'Link Reordering', fn: testLinkReordering },
        { name: 'Delete Link', fn: testDeleteLink }
      ]
    },
    {
      name: '📁 File Upload & Storage',
      tests: [
        { name: 'Avatar Upload', fn: testAvatarUpload },
        { name: 'Background Upload', fn: testBackgroundUpload },
        { name: 'File Upload Validation', fn: testFileUploadValidation }
        // Storage Info test removed - endpoint không tồn tại
      ]
    },
    {
      name: '📊 Analytics & Advanced Features',
      tests: [
        { name: 'Analytics Overview', fn: testAnalyticsOverview },
        { name: 'Links Analytics', fn: testLinksAnalytics }
      ]
    }
  ];

  // Run all test suites
  for (const suite of testSuites) {
    console.log(`\n${suite.name}`);
    console.log('-'.repeat(50));

    for (const test of suite.tests) {
      try {
        await test.fn();
        // Small delay between tests to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        logTest(test.name, false, `Exception: ${error.message}`, 0);
        console.error(`💥 ${test.name} threw error:`, error.message);
      }
    }
  }

  testStats.endTime = Date.now();
  const totalDuration = testStats.endTime - testStats.startTime;

  // Print final results
  console.log('\n' + '='.repeat(80));
  console.log('📊 FINAL TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${testStats.passed}`);
  console.log(`❌ Failed: ${testStats.failed}`);
  console.log(`⏭️  Skipped: ${testStats.skipped}`);
  console.log(`📈 Total Tests: ${testStats.total}`);
  console.log(`⏱️  Total Duration: ${Math.round(totalDuration / 1000)}s`);

  if (testStats.total > 0) {
    const successRate = Math.round((testStats.passed / testStats.total) * 100);
    console.log(`📊 Success Rate: ${successRate}%`);

    if (successRate >= 90) {
      console.log('\n🎉 EXCELLENT! API is working very well.');
    } else if (successRate >= 75) {
      console.log('\n✅ GOOD! API is mostly working with minor issues.');
    } else if (successRate >= 50) {
      console.log('\n⚠️  FAIR! API has some significant issues to address.');
    } else {
      console.log('\n❌ POOR! API has major issues that need immediate attention.');
    }
  }

  // Cleanup
  cleanupTestFiles();

  console.log('\n🧹 Test cleanup completed.');
  console.log('📝 Review the detailed logs above for specific issues.');
  console.log('='.repeat(80));
}

// =============================================================================
// EXPORT & EXECUTION
// =============================================================================

// =============================================================================
// USAGE INSTRUCTIONS
// =============================================================================
/*
CÁCH SỬ DỤNG SCRIPT TEST API:

1. Chạy toàn bộ test suite:
   node test-api.js

2. Chạy test từ Node.js REPL:
   const { runAllTests, testAdminLogin } = require('./test-api.js');
   runAllTests();
   // hoặc chạy test riêng lẻ:
   testAdminLogin();

3. Các tài khoản test có sẵn:
   - Admin: admin@lumilink.site / admin1234
   - Free User: userfree@lumilink.site / User@123
   - Premium User: userpremium@lumilink.site / User@123

4. Test coverage bao gồm:
   ✅ Basic API & Health Check
   ✅ Authentication & JWT
   ✅ RBAC (Role-Based Access Control)
   ✅ Profile Management
   ✅ Link CRUD Operations
   ✅ File Upload (Avatar/Background)
   ✅ Analytics & Advanced Features
   ✅ Security & Validation
   ✅ Performance & CORS

5. Kết quả test sẽ hiển thị:
   - Số test passed/failed/skipped
   - Thời gian response cho mỗi API call
   - Success rate tổng thể
   - Chi tiết lỗi nếu có

Lưu ý: Đảm bảo backend server đang chạy trên http://localhost:3001
*/

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  makeRequest,
  testStats,
  // Export individual test functions for selective testing
  testBasicApiEndpoint,
  testHealthCheck,
  testUserRegistration,
  testAdminLogin,
  testFreeUserLogin,
  testPremiumUserLogin,
  testCreateLink,
  testAvatarUpload,
  testAdminAccess,
  testPremiumFeatureAccess
};
