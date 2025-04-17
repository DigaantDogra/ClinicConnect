import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundCanvas } from "../../BackgroundCanvas";
import useSearchViewModel from './SearchViewModel';

export const Search = () => {
  const navigate = useNavigate();
  const { doctors, isLoading, error, fetchDoctors } = useSearchViewModel();

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleBookClick = (doctorId) => {
    navigate('/Patient/Booking', { state: { doctorId } });
  };

  return (
    <BackgroundCanvas section={
      <div className="flex flex-col items-center justify-start min-h-screen p-4">
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Available Doctors</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-500 text-xl font-semibold">
                          {doctor.name?.[0] || 'D'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{doctor.userName || 'Doctor'}</h3>
                      <p className="text-gray-600">{doctor.specialization || 'General Practitioner'}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{doctor.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{doctor.email || 'Contact not specified'}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => handleBookClick(doctor.id)}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    }/>
  );
};

  
