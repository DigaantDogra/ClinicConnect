import './App.css';
import { Navbar } from './Pages/NavBar';
import { Schedule } from './Pages/Patient/Appointment/Schedule';
import { Booking } from './Pages/Patient/Booking/Booking';
import { Home } from "./Pages/Patient/Home/Home";
import { Search } from './Pages/Patient/Search/Search'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App({ user = "patient" }) {
  return (
    <Router>
      {user === "patient" ? (
        <>
          <Navbar />
          <main className="flex-1 ml-20 p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Schedule" element={<Schedule />} />
              <Route path="/Search" element={<Search />} />
              <Route path="/Booking" element={<Booking />} />
            </Routes>
          </main>
        </>
      ) : (
        <div className="p-8">
          <h1>Doctors View</h1>
          {/* Add doctor-specific routes here */}
        </div>
      )}
    </Router>
  );
}

export default App;