import './App.css';
import { Navbar } from './Pages/NavBar';
import  PatientRecordManagement  from './Pages/HealthcareMangement/Patient/PatientRecordManagement';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from "./Pages/Patient/Home/Home"

function App() {
  return (
    <Router>
      <Navbar />
        <main className="flex-1 ml-20 p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patient/upload" element={<PatientRecordManagement />} />
            
          </Routes>
        </main>
    </Router>
  );
}

export default App;