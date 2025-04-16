import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const InitialSignup = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome to ClinicConnect</h2>
        <p className="welcome-text">
          Please sign up or log in to access our services
        </p>
        <div className="button-group">
          <button 
            className="auth-button" 
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
          <button 
            className="auth-button secondary" 
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialSignup; 