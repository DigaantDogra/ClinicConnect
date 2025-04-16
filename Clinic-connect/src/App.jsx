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
import { auth } from './Service/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import InitialSignup from './Pages/InitialSignup';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      setUserType("Patient"); // You can set this based on your authentication logic
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialSignup />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${userType}/Home`} />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to={`/${userType}/Home`} />} />
        
        {user ? (
          <>
            <Route path={`/${userType}`} element={<Navigate to={`/${userType}/Home`} />} />
            <Route path={`/${userType}/Home`} element={
              <>
                <Navbar user={userType} onLogout={handleLogout} />
                <main className="flex-1 ml-20 p-8">
                  {userType === "Patient" ? <PatientHome /> : <DoctorHome />}
                </main>
              </>
            } />
            <Route path={`/${userType}/Schedule`} element={
              <>
                <Navbar user={userType} onLogout={handleLogout} />
                <main className="flex-1 ml-20 p-8">
                  <PatientSchedule />
                </main>
              </>
            } />
            <Route path={`/${userType}/Search`} element={
              <>
                <Navbar user={userType} onLogout={handleLogout} />
                <main className="flex-1 ml-20 p-8">
                  <Search />
                </main>
              </>
            } />
            <Route path={`/${userType}/Booking`} element={
              <>
                <Navbar user={userType} onLogout={handleLogout} />
                <main className="flex-1 ml-20 p-8">
                  <PatientBooking />
                </main>
              </>
            } />
            <Route path={`/${userType}/Appointment`} element={
              <>
                <Navbar user={userType} onLogout={handleLogout} />
                <main className="flex-1 ml-20 p-8">
                  <DoctorAppointment />
                </main>
              </>
            } />
            <Route path={`/${userType}/Availability`} element={
              <>
                <Navbar user={userType} onLogout={handleLogout} />
                <main className="flex-1 ml-20 p-8">
                  <DoctorAvailability />
                </main>
              </>
            } />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;