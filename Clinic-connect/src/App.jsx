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
import { useState } from 'react';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import InitialSignup from './Pages/InitialSignup';
import UserTypeSelection from './Pages/UserTypeSelection';
import LoadingScreen from './Pages/Login';
import { UserProvider, useUser } from './Context/UserContext';

// Create a separate component for the authenticated layout
const AuthenticatedLayout = ({ children }) => {
  const { userType, userData, handleLogout } = useUser();
  return (
    <>
      <Navbar user={userType} onLogout={handleLogout} />
      <main className="flex-1 ml-20 p-8">
        {children}
      </main>
    </>
  );
};

// Create a separate component for protected routes
const ProtectedRoute = ({ children, requiredUserType }) => {
  const { user, userType, loading } = useUser();

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
  const { user, userType, userData, loading } = useUser();

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
        <ProtectedRoute requiredUserType="Patient">
          <Navigate to="/Patient/Home" />
        </ProtectedRoute>
      } />
      <Route path="/Patient/Home" element={
        <ProtectedRoute requiredUserType="Patient">
          <AuthenticatedLayout>
            <PatientHome userData={userData} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/Patient/Schedule" element={
        <ProtectedRoute requiredUserType="Patient">
          <AuthenticatedLayout>
            <PatientSchedule userData={userData} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/Patient/Search" element={
        <ProtectedRoute requiredUserType="Patient">
          <AuthenticatedLayout>
            <Search userData={userData} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/Patient/Booking" element={
        <ProtectedRoute requiredUserType="Patient">
          <AuthenticatedLayout>
            <PatientBooking userData={userData} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

      {/* Protected Doctor Routes */}
      <Route path="/Doctor" element={
        <ProtectedRoute requiredUserType="Doctor">
          <Navigate to="/Doctor/Home" />
        </ProtectedRoute>
      } />
      <Route path="/Doctor/Home" element={
        <ProtectedRoute requiredUserType="Doctor">
          <AuthenticatedLayout>
            <DoctorHome userData={userData} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/Doctor/Appointment" element={
        <ProtectedRoute requiredUserType="Doctor">
          <AuthenticatedLayout>
            <DoctorAppointment userData={userData} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/Doctor/Availability" element={
        <ProtectedRoute requiredUserType="Doctor">
          <AuthenticatedLayout>
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
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;