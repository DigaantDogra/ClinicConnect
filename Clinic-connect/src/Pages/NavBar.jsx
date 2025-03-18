import { Link, useLocation } from "react-router-dom";
import { BsHouseFill, BsFileEarmarkPerson, BsFileEarmarkArrowUpFill, BsCalendar2CheckFill, BsFileEarmarkTextFill } from "react-icons/bs";

export const Navbar = () => {
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 h-screen w-20 m-0 z-40 flex flex-col bg-white text-xl text-gray-600">
      <div className="max-h-4xl mt-40 py-4">
        <SideIcon
          icon={<BsHouseFill />}
          name="Home"
          path="/Home"
          isActive={location.pathname === "/Home"}
        />
        <SideIcon
          icon={<BsFileEarmarkPerson />}
          name="Search"
          path="/search"  // Update with your actual path
          isActive={location.pathname === "/search"}
        />
        <SideIcon
          icon={<BsFileEarmarkArrowUpFill />}
          name="Upload"
          path="/patient/upload"
          isActive={location.pathname === "/patient/upload"}
        />
        <SideIcon
          icon={<BsCalendar2CheckFill />}
          name="Schedule"
          path="/schedule"  // Update with your actual path
          isActive={location.pathname === "/schedule"}
        />
        <SideIcon
          icon={<BsFileEarmarkTextFill />}
          name="Healthcare Plan"
          path="/patient/healthcareplan"
          isActive={location.pathname === "/patient/healthcareplan"}
        />
      </div>
    </div>
  );
};

const SideIcon = ({ icon, name = "name", path, isActive }) => {
  return (
    <Link to={path} className={isActive ? "sidebar-icon group" : "sidebar-icon-h group"}>
      {icon}
      <span className={`sidebar-name ${isActive ? "" : "group-hover:scale-100"}`}>
        {name}
      </span>
    </Link>
  );
};