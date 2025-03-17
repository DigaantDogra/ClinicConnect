import { BsHouseFill, BsFileEarmarkPerson, BsFileEarmarkArrowUpFill, BsCalendar2CheckFill , BsFileEarmarkTextFill} from "react-icons/bs"


export const Navbar = ({ section }) => {
    

    return <>
        <div className="fixed top-0 left-0 h-screen w-20 m-0 
                                flex flex-col
                                bg-white text-xl text-gray-600">
            <div className="max-h-4xl mt-40 py-4">
                <SideIcon icon={<BsHouseFill />} />
                <SideIcon icon={<BsFileEarmarkPerson />} />
                <SideIcon icon={<BsFileEarmarkArrowUpFill />} />
                <SideIcon icon={<BsCalendar2CheckFill />} />
                <SideIcon icon={<BsFileEarmarkTextFill />} />
            </div>
        </div>
        <section>
            {section}
        </section>
    </>
}

const SideIcon = ({ icon }) => {
    return <div className="sidebar-icon">
        {icon}
    </div>
}

