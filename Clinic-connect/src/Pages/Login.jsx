import React, { useState } from 'react';
import { auth, db } from '../Service/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Try to get user data from both collections
      const [patientDoc, doctorDoc] = await Promise.all([
        getDoc(doc(db, 'patients', user.uid)),
        getDoc(doc(db, 'doctors', user.uid))
      ]);

      if (patientDoc.exists()) {
        const userData = patientDoc.data();
        navigate('/Patient/Home');
      } else if (doctorDoc.exists()) {
        const userData = doctorDoc.data();
        navigate('/Doctor/Home');
      } else {
        setError('User data not found');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <div className="form-group remember-me">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember for 30 days
            </label>
          </div>
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-divider">
          <span>Or</span>
        </div>
        <p className="auth-switch">
          Don't have an account? <span onClick={() => navigate('/signup')} className="auth-link">Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
