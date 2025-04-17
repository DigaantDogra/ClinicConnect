import React from 'react';
import { useUser } from '../../../Context/UserContext';
import { HomeSection } from './HomeSection';
import { BsPerson } from "react-icons/bs"

export const PatientHome = () => {
    const { getUserId, userData } = useUser();
    const userId = getUserId();

    return (
        <div className="fixed top-10 left-27">
            <div className="flex justify-between items-center">
                <div className="flex-col justify-items-start p-1">
                    <h1 className="text-4xl mb-3">Welcome, {userData?.name}</h1>
                    <h1 className='pl-4 pb-3'>{new Date().toLocaleDateString()}</h1>
                </div>

                <button className='text-3xl bg-white p-3 rounded-2xl mb-10 hover:bg-blue-300'>
                    <BsPerson />
                    {/* this will be replased with an image */}
                </button>
            </div>
            
            <HomeSection />
            
            <div className="p-8">
                <h2 className="text-xl font-semibold mb-4">Your Information</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Name:</p>
                            <p className="font-medium">{userData?.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Email:</p>
                            <p className="font-medium">{userData?.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">User ID:</p>
                            <p className="font-medium">{userId}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
