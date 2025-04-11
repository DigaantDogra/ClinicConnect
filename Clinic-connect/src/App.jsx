import './App.css';
import { Navbar } from './Pages/NavBar';
import { PatientSchedule } from './Pages/Patient/Appointment/Schedule';
import { PatientBooking } from './Pages/Patient/Booking/Booking';
import { PatientHome } from "./Pages/Patient/Home/Home";
import { Search } from './Pages/Patient/Search/Search'

import { DoctorHome } from './Pages/Doctor/Home/Home'
import { DoctorAppointment } from './Pages/Doctor/Appointment/Appointment'
import { DoctorAvailability } from './Pages/Doctor/Availability/Availability'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App({ user = "patient" }) {
  return (
    <Router>
      {user === "patient" ? (
        <>
          <Navbar />
          <main className="flex-1 ml-20 p-8">
            <Routes>
              <Route path="/" element={<PatientHome />} />
              <Route path="/Home" element={<PatientHome />} />
              <Route path="/Schedule" element={<PatientSchedule />} />
              <Route path="/Search" element={<Search />} />
              <Route path="/Booking" element={<PatientBooking />} />
            </Routes>
          </main>
        </>
      ) : (
        <div className="p-8">
          <Navbar />
          <main className="flex-1 ml-20 p-8">
            <Routes>
              <Route path="/" element={<DoctorHome />} />
              <Route path="/Home" element={<DoctorHome />} />
              <Route path="/Appointment" element={<DoctorAppointment />} />
              <Route path="/Availability" element={<DoctorAvailability />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;