import './App.css'
import { Navbar } from './Pages/NavBar'
import { Schedule } from './Pages/Patient/Appointment/Schedule';
import { Home } from "./Pages/Patient/Home/Home"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
    <Router>
    <Navbar/>
        <main className="flex-1 ml-20 p-8">
          <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/Schedule" element={<Schedule />} />
          </Routes>
        </main>
    </Router>
    </>
  )
}

export default App
