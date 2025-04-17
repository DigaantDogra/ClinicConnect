import { useState } from "react"
import { Link, useLocation } from "react-router-dom";
import { BsHouseFill, BsFileEarmarkPerson, BsFileEarmarkArrowUpFill, BsCalendar2CheckFill, BsFileEarmarkTextFill, BsCalendarEvent, BsFileEarmarkPlus, BsFileEarmark, BsFileCheck } from "react-icons/bs"

const defaultPage = "Home"

export const Navbar = ({ user = "Patient" }) => {
    let [activeIcon, setActiveIcon] = useState(defaultPage);
    const location = useLocation();
    const isDoctor = location.pathname.includes("/Doctor");
  
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
                <SideIcon
                  icon={<BsFileEarmarkPlus />}
                  name={`${user}/GeneratePlan`}
                  isActive={activeIcon === "GeneratePlan"}
                  onClick={() => setActiveIcon("GeneratePlan")}
                />
                <SideIcon
                  icon={<BsFileEarmark />}
                  name={`${user}/DraftPlan`}
                  isActive={activeIcon === "DraftPlan"}
                  onClick={() => setActiveIcon("DraftPlan")}
                />
                <SideIcon
                  icon={<BsFileCheck />}
                  name={`${user}/Approval`}
                  isActive={activeIcon === "Approval"}
                  onClick={() => setActiveIcon("Approval")}
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