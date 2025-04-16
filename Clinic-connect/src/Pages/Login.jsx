import React, { useState } from 'react';
import { auth } from '../Service/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Welcome back!</h1>
        <p className="auth-subtitle">Enter your Credentials to access your account</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <div className="password-header">
              <label>Password</label>
              <a href="#" className="forgot-password">forgot password</a>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group remember-me">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember for 30 days
            </label>
          </div>
          <button type="submit" className="auth-button">Login</button>
        </form>
        <div className="auth-divider">
          <span>Or</span>
        </div>
        <div className="social-buttons">
          <button className="social-button google">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
            Sign in with Google
          </button>
          <button className="social-button apple">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
            Sign in with Apple
          </button>
        </div>
        <p className="auth-switch">
          Don't have an account? <span onClick={() => navigate('/signup')} className="auth-link">Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
