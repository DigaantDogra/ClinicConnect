import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsHouseFill, BsFileEarmarkPerson, BsFileEarmarkArrowUpFill, BsCalendar2CheckFill, BsFileEarmarkTextFill, BsCalendarEvent } from "react-icons/bs"
import { signOut } from 'firebase/auth';
import { auth } from '../Service/firebase';

const defaultPage = "Home"

export const Navbar = ({ user, onLogout }) => {
    let [activeIcon, setActiveIcon] = React.useState(defaultPage);
    const location = useLocation();
    const isDoctor = location.pathname.includes("/Doctor");
    const navigate = useNavigate();
  
    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('/');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };
  
    return (
      <>
        <div className="fixed top-0 left-0 h-screen w-20 m-0 z-40 flex flex-col bg-white text-xl text-gray-600">
          <div className="max-h-4xl mt-40 py-4">
            <SideIcon
              icon={<BsHouseFill />}
              name={`${user}/Home`}
              isActive={activeIcon === "Home"}
              onClick={() => setActiveIcon("Home")}
            />
            {isDoctor ? (
              <>
                <SideIcon
                  icon={<BsCalendarEvent />}
                  name={`${user}/Appointment`}
                  isActive={activeIcon === "Appointment"}
                  onClick={() => setActiveIcon("Appointment")}
                />
                <SideIcon
                  icon={<BsCalendar2CheckFill />}
                  name={`${user}/Availability`}
                  isActive={activeIcon === "Availability"}
                  onClick={() => setActiveIcon("Availability")}
                />
              </>
            ) : (
              <>
                <SideIcon
                  icon={<BsFileEarmarkPerson />}
                  name={`${user}/Search`}
                  isActive={activeIcon === "Search"}
                  onClick={() => setActiveIcon("Search")}
                />
                <SideIcon
                  icon={<BsCalendar2CheckFill />}
                  name={`${user}/Schedule`}
                  isActive={activeIcon === "Schedule"}
                  onClick={() => setActiveIcon("Schedule")}
                />
                <SideIcon
                  icon={<BsFileEarmarkTextFill />}
                  name={`${user}/Planner`}
                  isActive={activeIcon === "Planner"}
                  onClick={() => setActiveIcon("Planner")}
                />
              </>
            )}
          </div>
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full p-2 bg-red-600 hover:bg-red-700 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </>
    );
  };
  
  const SideIcon = ({ icon, name = "Home", isActive = false, onClick }) => {
    const displayName = name.split('/').pop();
    return (
      <Link to={`/${name}`} onClick={onClick} className={isActive ? "sidebar-icon group" : "sidebar-icon-h group"}>
            {icon}
            <span className={`sidebar-name ${isActive ? "" : "group-hover:scale-100"}`}>
            {displayName}
            </span>
      </Link>
    );
  };