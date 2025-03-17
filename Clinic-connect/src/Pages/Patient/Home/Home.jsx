import { useState, useEffect } from 'react';
import { HomeSection } from './HomeSection';
import { BsPerson } from "react-icons/bs"

export const Home = ({ userName = "User" }) => {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const formatDate = (date) => {
        const options = { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        };
        const [weekday, month, day, year] = date.toLocaleDateString('en-US', options).split(/,\s|\s/);
        
        return `${weekday}, ${day} ${month} ${year}`;
        };

        setCurrentDate(formatDate(new Date()));
    }, []);


    return <div className="fixed top-10 left-27">
        <div className="flex justify-between items-center">
            <div className="flex-col justify-items-start p-1">
                <h1 className="text-4xl mb-3">Welcome, {userName}</h1>
                <h1 className='pl-4 pb-3'>{currentDate}</h1>
            </div>

            <button className='text-3xl bg-white p-3 rounded-2xl mb-10 hover:bg-blue-300'>
                <BsPerson />
                {/* this will be replased with an image */}
            </button>
        </div>
        
        <HomeSection />
        
    </div>
}