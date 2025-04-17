import './App.css';
import { Navbar } from './Pages/NavBar';
import { PatientSchedule } from './Pages/Patient/Appointment/Schedule';
import { PatientBooking } from './Pages/Patient/Booking/Booking';
import { PatientHome } from "./Pages/Patient/Home/Home";
import { Search } from './Pages/Patient/Search/Search'
import { DoctorHome } from './Pages/Doctor/Home/Home'
import { DoctorAppointment } from './Pages/Doctor/Appointment/Appointment'
import { DoctorAvailability } from './Pages/Doctor/Availability/Availability'
import GeneratePlanPage from './Pages/Doctor/GenerateHealthcarePlan/GeneratePlanPage'
import DraftPlanPage from './Pages/Doctor/ExamineHealthcarePlan/DraftPlanPage'
import ApprovalPage from './Pages/Doctor/ExamineHealthcarePlan/ApprovalPage'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App({ user = "Patient" }) {
  return (
    <Router>
      <div className={user === "Patient" ? "" : "p-8"}>
        <Navbar user={user} />
        <main className="flex-1 ml-20 p-8">
          <Routes>
            <Route path="/" element={<Navigate to={`/${user}`} replace />} />
            {user === "Patient" ? (
              <>
              </>
            ) : (
              <>
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;