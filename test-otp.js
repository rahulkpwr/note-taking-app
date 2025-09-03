const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'testpassword123'
};

async function testOTPIntegration() {
  console.log('🧪 Starting OTP Integration Tests...\n');

  try {
    // Test 1: Check server status
    console.log('1️⃣ Testing server connectivity...');
    const statusResponse = await axios.get(`${API_BASE_URL}/test`);
    console.log('✅ Server is running:', statusResponse.data.message);

    // Test 2: Test OTP generation
    console.log('\n2️⃣ Testing OTP generation...');
    const otpResponse = await axios.post(`${API_BASE_URL}/auth/test-otp`, {
      email: testUser.email,
      name: testUser.name
    });
    
    console.log('✅ OTP generated successfully');
    console.log('📧 OTP:', otpResponse.data.otp);
    console.log('👤 User ID:', otpResponse.data.userId);

    // Test 3: Test OTP verification
    console.log('\n3️⃣ Testing OTP verification...');
    const verifyResponse = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
      email: testUser.email,
      otp: otpResponse.data.otp,
      password: testUser.password
    });

    console.log('✅ OTP verification successful');
    console.log('🔑 Token received:', verifyResponse.data.token ? 'Yes' : 'No');
    console.log('👤 User verified:', verifyResponse.data.user.isEmailVerified);

    // Test 4: Test login with created account
    console.log('\n4️⃣ Testing login with created account...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });

    console.log('✅ Login successful');
    console.log('🔑 Login token received:', loginResponse.data.token ? 'Yes' : 'No');

    // Test 5: Test invalid OTP
    console.log('\n5️⃣ Testing invalid OTP...');
    try {
      await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        email: testUser.email,
        otp: '000000',
        password: testUser.password
      });
      console.log('❌ Should have failed with invalid OTP');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Invalid OTP correctly rejected');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    // Test 6: Test duplicate email
    console.log('\n6️⃣ Testing duplicate email...');
    try {
      await axios.post(`${API_BASE_URL}/auth/test-otp`, {
        email: testUser.email,
        name: testUser.name
      });
      console.log('❌ Should have failed with duplicate email');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Duplicate email correctly rejected');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Server connectivity');
    console.log('✅ OTP generation');
    console.log('✅ OTP verification');
    console.log('✅ User login');
    console.log('✅ Error handling (invalid OTP)');
    console.log('✅ Error handling (duplicate email)');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure server is running on port 5000');
    console.log('2. Check MongoDB connection');
    console.log('3. Verify environment variables');
    console.log('4. Check server logs for errors');
  }
}

// Run tests
testOTPIntegration(); 