import './App.css';
import { Navbar } from './Pages/NavBar';
import { PatientSchedule } from './Pages/Patient/Appointment/Schedule';
import { PatientBooking } from './Pages/Patient/Booking/Booking';
import { PatientHome } from "./Pages/Patient/Home/Home";
import { Search } from './Pages/Patient/Search/Search'
import { DoctorHome } from './Pages/Doctor/Home/Home'
import { DoctorAppointment } from './Pages/Doctor/Appointment/Appointment'
import { DoctorAvailability } from './Pages/Doctor/Availability/Availability'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './Service/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import InitialSignup from './Pages/InitialSignup';
import UserTypeSelection from './Pages/UserTypeSelection';
import LoadingScreen from './Pages/Login';

// Create a separate component for the authenticated layout
const AuthenticatedLayout = ({ userType, userData, onLogout, children }) => (
  <>
    <Navbar user={userType} onLogout={onLogout} />
    <main className="flex-1 ml-20 p-8">
      {children}
    </main>
  </>
);

// Create a separate component for protected routes
const ProtectedRoute = ({ children, requiredUserType, user, userType, loading }) => {
  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to={`/${userType}/Home`} />;
  }

  return children;
};

// Create a separate component for the app content
const AppContent = () => {
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={!user ? <InitialSignup /> : <Navigate to={`/${userType}/Home`} />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${userType}/Home`} />} />
      <Route path="/select-type" element={!user ? <UserTypeSelection /> : <Navigate to={`/${userType}/Home`} />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to={`/${userType}/Home`} />} />
      
      {/* Protected Patient Routes */}
      <Route path="/Patient" element={
        <ProtectedRoute user={user} userType={userType} loading={loading} requiredUserType="Patient">
          <Navigate to="/Patient/Home" />
        </ProtectedRoute>
      } />
      <Route path="/Patient/Home" element={
        <ProtectedRoute user={user} userType={userType} loading={loading} requiredUserType="Patient">
          <AuthenticatedLayout userType={userType} userData={userData} onLogout={handleLogout}>
            <PatientHome userData={userData} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/Patient/Schedule" element={
        <ProtectedRoute user={user} userType={userType} loading={loading} requiredUserType="Patient">
          <AuthenticatedLayout userType={userType} userData={userData} onLogout={handleLogout}>
            <PatientSchedule userData={userData} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/Patient/Search" element={
        <ProtectedRoute user={user} userType={userType} loading={loading} requiredUserType="Patient">
          <AuthenticatedLayout userType={userType} userData={userData} onLogout={handleLogout}>
            <Search userData={userData} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/Patient/Booking" element={
        <ProtectedRoute user={user} userType={userType} loading={loading} requiredUserType="Patient">
          <AuthenticatedLayout userType={userType} userData={userData} onLogout={handleLogout}>
            <PatientBooking userData={userData} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

      {/* Protected Doctor Routes */}
      <Route path="/Doctor" element={
        <ProtectedRoute user={user} userType={userType} loading={loading} requiredUserType="Doctor">
          <Navigate to="/Doctor/Home" />
        </ProtectedRoute>
      } />
      <Route path="/Doctor/Home" element={
        <ProtectedRoute user={user} userType={userType} loading={loading} requiredUserType="Doctor">
          <AuthenticatedLayout userType={userType} userData={userData} onLogout={handleLogout}>
            <DoctorHome userData={userData} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/Doctor/Appointment" element={
        <ProtectedRoute user={user} userType={userType} loading={loading} requiredUserType="Doctor">
          <AuthenticatedLayout userType={userType} userData={userData} onLogout={handleLogout}>
            <DoctorAppointment userData={userData} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/Doctor/Availability" element={
        <ProtectedRoute user={user} userType={userType} loading={loading} requiredUserType="Doctor">
          <AuthenticatedLayout userType={userType} userData={userData} onLogout={handleLogout}>
            <DoctorAvailability userData={userData} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to={user ? `/${userType}/Home` : "/"} />} />
    </Routes>
  );
};

// Main App component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;