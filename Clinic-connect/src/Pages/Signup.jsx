import React, { useState, useEffect } from 'react';
import { auth } from '../Service/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { BsApple, BsGoogle } from "react-icons/bs"
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    // Get user type from localStorage
    const storedUserType = localStorage.getItem('selectedUserType');
    console.log('Stored user type:', storedUserType);
    
    if (!storedUserType) {
      console.log('No user type found in localStorage, redirecting to select-type');
      navigate('/select-type');
    } else {
      setUserType(storedUserType);
    }
  }, [navigate]);

  // If no user type is selected, show loading state
  if (!userType) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">Loading...</h1>
        </div>
      </div>
    );
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setError('Please agree to the terms & policy');
      return;
    }

    // Debug before signup
    console.log('Attempting signup with userType:', userType);

    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created in Firebase Auth:', user.uid);

      // Set custom display name with prefix based on user type
      const prefix = userType === 'Doctor' ? 'D' : 'P';
      const updatedId = `${prefix}${user.uid}`;
      await updateProfile(user, { updatedId });
      console.log('User profile updated with display name:', updatedId);

      // Determine the correct collection based on user type
      const collectionName = userType === 'Doctor' ? 'doctors' : 'patients';
      console.log('Creating document in collection:', collectionName);

      // Create a user document in the appropriate Firestore collection
      const userDoc = userType === 'Doctor' ? {
        UserName: name,
        Email: email,
        Id: updatedId,
        Type: userType,
        CarePlanIds:[],
        AppointmentIds:[],
        Notifications:[],
        AvailabilityIds:[]
      } : {
        UserName: name,
        Email: email,
        Id: updatedId,
        Type: userType,
        CarePlanIds:[],
        AppointmentIds:[],
        Notifications:[]
      };
      console.log('Creating document with data:', userDoc);

      await setDoc(doc(db, collectionName, user.uid), userDoc);
      console.log('Document created successfully');

      // Clear the stored user type
      localStorage.removeItem('selectedUserType');

      // Debug before navigation
      console.log('Signup successful, navigating to:', `/${userType}/Home`);

      // Navigate to appropriate home page based on user type
      navigate(`/${userType}/Home`, { replace: true });
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-subtitle">Sign up as a {userType}</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group terms-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              /> &nbsp;
              I agree to the <a href="#" className="terms-link">terms & policy</a>
            </label>
          </div>
          <button type="submit" className="auth-button">Sign up</button>
        </form>
        <div className="auth-divider">
          <span>Or</span>
        </div>
        <div className="social-buttons">
          <button className="social-button google">
            <BsGoogle />
            Sign in with Google
          </button>
          <button className="social-button apple">
            <BsApple />
            Sign in with Apple
          </button>
        </div>
        <p className="auth-switch">
          Have an account? <span onClick={() => navigate('/login')} className="auth-link">Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;