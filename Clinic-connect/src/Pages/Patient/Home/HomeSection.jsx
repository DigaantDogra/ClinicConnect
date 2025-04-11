import { Link } from "react-router-dom";
import { BackgroundCanvas } from "../../BackgroundCanvas"

export const HomeSection = () => {
    return <BackgroundCanvas section={
        <div className="flex justify-center items-center mx-auto">

            <Link to="/Search" className="home-btn">
                <h1 className="home-h1">Book Appointment</h1>
            </Link>

            <Link to="/Planner" className="home-btn">
                <h1 className="home-h1">Examine Health plan</h1>
                </Link>

        </div>
    } />
    
}