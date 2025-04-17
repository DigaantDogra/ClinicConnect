import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const InitialSignup = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-left">
          <h1 className="home-title">Welcome to <span className="brand-name">ClinicConnect</span></h1>
          <p className="home-description">
            Your trusted platform for seamless healthcare management. Connect with healthcare providers, 
            schedule appointments, and manage your medical journey all in one place.
          </p>
          <div className="home-buttons">
            <button 
              className="home-button primary"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </button>
            <button 
              className="home-button secondary"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
          <div className="home-features">
            <div className="feature-item">
              <div className="feature-icon">📅</div>
              <div className="feature-text">Easy Appointment Scheduling</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">👨‍⚕️</div>
              <div className="feature-text">Connect with Healthcare Providers</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <div className="feature-text">Manage Your Health Records</div>
            </div>
          </div>
        </div>
        <div className="home-right">
          <div className="home-image">
            <img 
              src="https://img.freepik.com/free-vector/hospital-building-concept-illustration_114360-8440.jpg?w=740&t=st=1709850427~exp=1709851027~hmac=7e6b6f657d94b39c8c0f01b25b8c2b4e9e8e8f9b8e8e8f9b8e8e8f9b8e8e8f9b" 
              alt="Healthcare Illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialSignup;