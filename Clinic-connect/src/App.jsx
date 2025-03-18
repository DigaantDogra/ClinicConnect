import './App.css';
import { Navbar } from './Pages/NavBar';
import  PatientRecordManagement  from './Pages/Patient/HealthcareManagement/PatientRecordManagement';
import PatientHealthcarePlan from './Pages/Patient/HealthcareManagement/PatientHealthcarePlan';
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
       
        </Routes>
      </main>
    </Router>
  );
}

export default App;