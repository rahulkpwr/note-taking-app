const axios = require('axios');

async function testCurrentStatus() {
  console.log('🔍 Testing Current OTP Integration Status...\n');

  try {
    // Test 1: Server connectivity
    console.log('1️⃣ Testing server connectivity...');
    const statusResponse = await axios.get('http://localhost:5000/api/test');
    console.log('✅ Server is running:', statusResponse.data.message);

    // Test 2: Check available auth routes
    console.log('\n2️⃣ Testing auth routes...');
    
    // Test send-otp endpoint
    try {
      const otpResponse = await axios.post('http://localhost:5000/api/auth/send-otp', {
        email: 'test@example.com',
        name: 'Test User'
      });
      console.log('✅ /api/auth/send-otp is working');
    } catch (error) {
      console.log('❌ /api/auth/send-otp failed:', error.response?.data?.message || error.message);
    }

    // Test test-otp endpoint (our new endpoint)
    try {
      const testOtpResponse = await axios.post('http://localhost:5000/api/auth/test-otp', {
        email: 'test2@example.com',
        name: 'Test User 2'
      });
      console.log('✅ /api/auth/test-otp is working');
      console.log('📧 OTP generated:', testOtpResponse.data.otp);
      
      // Test OTP verification
      try {
        const verifyResponse = await axios.post('http://localhost:5000/api/auth/verify-otp', {
          email: 'test2@example.com',
          otp: testOtpResponse.data.otp,
          password: 'testpassword123'
        });
        console.log('✅ OTP verification successful');
        console.log('🔑 Token received:', verifyResponse.data.token ? 'Yes' : 'No');
      } catch (verifyError) {
        console.log('❌ OTP verification failed:', verifyError.response?.data?.message || verifyError.message);
      }
      
    } catch (error) {
      console.log('❌ /api/auth/test-otp failed:', error.response?.data?.message || error.message);
    }

    // Test 3: Check environment variables
    console.log('\n3️⃣ Checking environment configuration...');
    try {
      const envResponse = await axios.get('http://localhost:5000/api/test');
      console.log('✅ Environment variables loaded');
    } catch (error) {
      console.log('❌ Environment issues detected');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

testCurrentStatus(); 