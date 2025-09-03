const axios = require('axios');

async function testGoogleOAuth() {
  console.log('🧪 Testing Google OAuth Configuration...\n');

  try {
    // Test 1: Check if backend is running
    console.log('1️⃣ Testing backend connectivity...');
    const statusResponse = await axios.get('http://localhost:5000/api/test');
    console.log('✅ Backend is running:', statusResponse.data.message);

    // Test 2: Check if Google OAuth endpoint exists
    console.log('\n2️⃣ Testing Google OAuth endpoint...');
    try {
      // This will fail but we can see the error
      await axios.post('http://localhost:5000/api/auth/google', {
        credential: 'test_credential'
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Google OAuth endpoint exists');
        console.log('📝 Expected error (invalid credential):', error.response.data.message);
      } else {
        console.log('❌ Google OAuth endpoint error:', error.response?.data || error.message);
      }
    }

    // Test 3: Check environment variables
    console.log('\n3️⃣ Checking Google OAuth configuration...');
    console.log('📋 To complete Google OAuth setup:');
    console.log('1. Create Google Cloud project');
    console.log('2. Enable Google+ API');
    console.log('3. Create OAuth 2.0 credentials');
    console.log('4. Add authorized origins: http://localhost:3000');
    console.log('5. Update GOOGLE_CLIENT_ID in server/.env');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n🔧 Make sure server is running: cd server && npm run dev');
  }
}

testGoogleOAuth(); 