import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const UserTypeSelection = () => {
  const [selectedType, setSelectedType] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedType) {
      setError('Please select a user type');
      return;
    }
    // Store the selected type in localStorage
    localStorage.setItem('selectedUserType', selectedType);
    navigate('/signup');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Choose Your Role</h1>
        <p className="auth-subtitle">Select how you want to use ClinicConnect</p>
        {error && <div className="error-message">{error}</div>}
        
        <div className="user-type-options">
          <div 
            className={`user-type-option ${selectedType === 'Patient' ? 'selected' : ''}`}
            onClick={() => setSelectedType('Patient')}
          >
            <div className="user-type-icon">👤</div>
            <div className="user-type-content">
              <h3>Patient</h3>
              <p>Book appointments, manage health records, and connect with doctors</p>
            </div>
          </div>

          <div 
            className={`user-type-option ${selectedType === 'Doctor' ? 'selected' : ''}`}
            onClick={() => setSelectedType('Doctor')}
          >
            <div className="user-type-icon">👨‍⚕️</div>
            <div className="user-type-content">
              <h3>Doctor</h3>
              <p>Manage appointments, set availability, and provide healthcare services</p>
            </div>
          </div>
        </div>

        <button 
          className="auth-button"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default UserTypeSelection; 