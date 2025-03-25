import './App.css';
import { Navbar } from './Pages/NavBar';
import  PatientRecordManagement  from './Pages/Patient/HealthcareManagement/PatientRecordManagement';
import PatientHealthcarePlan from './Pages/Patient/HealthcareManagement/PatientHealthcarePlan';
import GeneratePlanPage from './Pages/Doctor/GeneratePlanPage';
import DraftPlanPage from './Pages/Doctor/DraftPlanPage';
import ApprovalPage from './Pages/Doctor/ApprovalPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from "./Pages/Patient/Home/Home"

function App() {
  return (
    <Router>
      <Navbar />
      <main className="flex-1 ml-20 p-8">
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/patient/upload" element={<PatientRecordManagement />} />
          <Route path="/patient/healthcareplan" element={<PatientHealthcarePlan />} />
          <Route path="/doctor/generate" element={<GeneratePlanPage />} />
          <Route path="/doctor/plan" element={<DraftPlanPage />} />
          <Route path="/doctor/approval" element={<ApprovalPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;