import { BsHouseFill } from "react-icons/bs"

export const Navbar = () => {
    

    return <div className="fixed top-0 left-0 h-screen w-20 m-0 
                            flex flex-col
                            bg-white text-gray-600">
        <SideIcon icon={<BsHouseFill />}></SideIcon>
        <i>C</i>
        <i>D</i>

    </div>
}

const SideIcon = ({ icon }) => {
    return <div className="sidebar-icon">
        {icon}
    </div>
}

