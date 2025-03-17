import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { BsHouseFill, BsFileEarmarkPerson, BsFileEarmarkArrowUpFill, BsCalendar2CheckFill , BsFileEarmarkTextFill} from "react-icons/bs"

const defaultPage = "Home"

export const Navbar = () => {
    let [activeIcon, setActiveIcon] = useState(null);

    useEffect(() => {
        setActiveIcon(defaultPage)
    })
  
    return (
      <>
        <div className="fixed top-0 left-0 h-screen w-20 m-0 z-40 flex flex-col bg-white text-xl text-gray-600">
          <div className="max-h-4xl mt-40 py-4">
            <SideIcon
              icon={<BsHouseFill />}
              name="Home"
              isActive={activeIcon === "Home"}
              onClick={() => setActiveIcon("Home")}
            />
            <SideIcon
              icon={<BsFileEarmarkPerson />}
              name="Search"
              isActive={activeIcon === "Search"}
              onClick={() => setActiveIcon("Search")}
            />
            <SideIcon
              icon={<BsFileEarmarkArrowUpFill />}
              name="Upload"
              isActive={activeIcon === "Upload"}
              onClick={() => setActiveIcon("Upload")}
            />
            <SideIcon
              icon={<BsCalendar2CheckFill />}
              name="Schedule"
              isActive={activeIcon === "Schedule"}
              onClick={() => setActiveIcon("Schedule")}
            />
            <SideIcon
              icon={<BsFileEarmarkTextFill />}
              name="Planner"
              isActive={activeIcon === "Planner"}
              onClick={() => setActiveIcon("Planner")}
            />
          </div>
        </div>
      </>
    );
  };
  
  const SideIcon = ({ icon, name = "Home", isActive = false, onClick }) => {
    return (
      <Link to={`/${name}`} onClick={onClick} className={isActive ? "sidebar-icon group" : "sidebar-icon-h group"}>
            {icon}
            <span className={`sidebar-name ${isActive ? "" : "group-hover:scale-100"}`}>
            {name}
            </span>
      </Link>
    );
  };