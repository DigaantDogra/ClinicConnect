import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../Service/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Try to get user data from both collections
          const [patientDoc, doctorDoc] = await Promise.all([
            getDoc(doc(db, 'patients', user.uid)),
            getDoc(doc(db, 'doctors', user.uid))
          ]);

          if (patientDoc.exists()) {
            const data = patientDoc.data();
            console.log('Patient data:', data);
            setUserData(data);
            setUserType('Patient');
          } else if (doctorDoc.exists()) {
            const data = doctorDoc.data();
            setUserData(data);
            setUserType('Doctor');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
        setUserType(null);
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserType(null);
      setUserData(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Helper function to get the user's ID
  const getUserId = () => {
    if (!user) return null;
    return user.uid;
  };

  const value = {
    user,
    userType,
    userData,
    loading,
    handleLogout,
    getUserId
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 