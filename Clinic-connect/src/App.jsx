import './App.css';
import { Navbar } from './Pages/NavBar';
import { PatientSchedule } from './Pages/Patient/Appointment/Schedule';
import { PatientBooking } from './Pages/Patient/Booking/Booking';
import { PatientHome } from "./Pages/Patient/Home/Home";
import { Search } from './Pages/Patient/Search/Search'

import { DoctorHome } from './Pages/Doctor/Home/Home'
import { DoctorAppointment } from './Pages/Doctor/Appointment/Appointment'
import { DoctorAvailability } from './Pages/Doctor/Availability/Availability'
import GeneratePlanPage from './Pages/Doctor/GeneratePlanPage'
import DraftPlanPage from './Pages/Doctor/DraftPlanPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App({ user = "Patient" }) {
  return (
    <Router>
      {user === "Patient" ? (
        <>
          <Navbar user={user} />
          <main className="flex-1 ml-20 p-8">
            <Routes>
              <Route path={`/${user}`} element={<PatientHome userName={user} />} />
              <Route path={`/${user}/Home`} element={<PatientHome userName={user} />} />
              <Route path={`/${user}/Schedule`} element={<PatientSchedule userName={user} />} />
              <Route path={`/${user}/Search`} element={<Search/>} />
              <Route path={`/${user}/Booking`} element={<PatientBooking userName={user} />} />
            </Routes>
          </main>
        </>
      ) : (
        <div className="p-8">
          <Navbar user={user} />
          <main className="flex-1 ml-20 p-8">
            <Routes>
              <Route path={`/${user}`} element={<DoctorHome />} />
              <Route path={`/${user}/Home`} element={<DoctorHome />} />
              <Route path={`/${user}/Appointment`} element={<DoctorAppointment />} />
              <Route path={`/${user}/Availability`} element={<DoctorAvailability />} />
              <Route path={`/${user}/GeneratePlan`} element={<GeneratePlanPage />} />
              <Route path={`/${user}/DraftPlan`} element={<DraftPlanPage />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;