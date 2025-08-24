const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

async function testCreateLinkWithExistingUsers() {
  console.log('🔍 Testing Create Link with Existing Users...\n');
  
  const users = [
    {
      name: 'Admin User',
      email: 'admin@lumilink.site',
      password: 'Admin@123'
    },
    {
      name: 'Free User',
      email: 'userfree@lumilink.site', 
      password: 'User@123'
    },
    {
      name: 'Premium User',
      email: 'userpremium@lumilink.site',
      password: 'User@123'
    }
  ];

  for (const user of users) {
    console.log(`\n=== Testing with ${user.name} ===`);
    
    try {
      // Step 1: Login
      console.log(`1. Logging in as ${user.name}...`);
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: user.email,
        password: user.password
      });
      
      console.log('✅ Login successful');
      console.log('👤 Username:', loginResponse.data.user?.username);
      console.log('🔑 Role:', loginResponse.data.user?.role);
      
      const token = loginResponse.data.token;
      const username = loginResponse.data.user?.username;
      
      // Step 2: Check profile
      console.log('\n2. Checking profile...');
      try {
        const profileResponse = await axios.get(`${BASE_URL}/profiles/${username}`);
        console.log('✅ Profile exists');
        console.log('📊 Profile ID:', profileResponse.data.profile?.id || 'undefined');
      } catch (error) {
        console.log('❌ Profile check failed:', error.response?.status);
      }
      
      // Step 3: Check existing links
      console.log('\n3. Getting existing links...');
      try {
        const linksResponse = await axios.get(`${BASE_URL}/links/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('✅ Links retrieved');
        console.log('🔗 Current links count:', linksResponse.data.links?.length || 0);
      } catch (error) {
        console.log('❌ Links check failed:', error.response?.status);
      }
      
      // Step 4: Try to create link
      console.log('\n4. Creating new link...');
      const linkData = {
        title: `Test Link from ${user.name}`,
        url: 'https://example.com',
        description: `Test link created by ${user.name}`,
        type: 'website',
        icon: 'website',
        isVisible: true,
        sortOrder: 0
      };
      
      try {
        const linkResponse = await axios.post(`${BASE_URL}/links`, linkData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ Link created successfully!');
        console.log('🔗 Link ID:', linkResponse.data.link?.id);
        console.log('📝 Link title:', linkResponse.data.link?.title);
        
      } catch (error) {
        console.log('❌ Link creation failed:');
        console.log('📊 Status:', error.response?.status);
        console.log('📝 Error message:', error.response?.data?.message);
        console.log('🔍 Error details:', error.response?.data?.error);
        
        if (error.response?.status === 500) {
          console.log('🚨 Server Error - Check backend logs');
        }
      }
      
    } catch (loginError) {
      console.log('❌ Login failed for', user.name);
      console.log('📊 Status:', loginError.response?.status);
      console.log('📝 Error:', loginError.response?.data?.message);
    }
    
    console.log('\n' + '='.repeat(50));
  }
}

// Run the test
testCreateLinkWithExistingUsers().then(() => {
  console.log('\n✅ All tests completed');
}).catch(error => {
  console.log('\n❌ Test suite error:', error.message);
});
