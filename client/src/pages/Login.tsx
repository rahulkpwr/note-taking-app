import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Login.css';
import blueBg from '../assets/blue-bg.png';
import { GoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      login(response.token, response.user);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.googleAuth({ credential: credentialResponse.credential });
      login(response.token, response.user);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed');
  };

  return (
    <div className="login-split-container">
      <div className="login-split-card">
        <div className="login-form-section">
          <div className="login-logo-placeholder">NT</div>
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={0}
                >
                  {showPassword ? (
                    // Eye-off SVG
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.13 0 2.21.195 3.225.555M19.07 19.07A9.953 9.953 0 0021 12c0-1.657-.404-3.216-1.12-4.555M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" /></svg>
                  ) : (
                    // Eye SVG
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 3-4 7-9 7s-9-4-9-7 4-7 9-7 9 4 9 7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              width="100%"
              useOneTap
            />
            <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginTop: '8px' }}>
              Google OAuth requires configuration. Email + OTP is fully functional.
            </p>
          </div>

          <div className="signup-link">
            <p>
              Don't have an account?{' '}
              <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
        <div className="login-image-section">
          <img src={blueBg} alt="Blue background" />
        </div>
      </div>
    </div>
  );
};

export default Login; 