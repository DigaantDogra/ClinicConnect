import React, { useEffect } from 'react';
import useScheduleViewModel from './ScheduleViewModel';
import { Link, useNavigate } from "react-router-dom";
import { BsTrashFill, BsPencilFill } from "react-icons/bs"
import { BackgroundCanvas } from '../../BackgroundCanvas';

// Mock user ID for testing - replace this with actual auth later
const MOCK_USER_ID = 'patient-123';

export const PatientSchedule = () => {
  const { appointments, isLoading, error, fetchAppointments, deleteAppointment } = useScheduleViewModel();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments(MOCK_USER_ID);
  }, [fetchAppointments]);

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await deleteAppointment(appointmentId);
        // The appointments list will be automatically refreshed by the view model
      } catch (err) {
        console.error('Error cancelling appointment:', err);
      }
    }
  };

  const handleEditClick = (appointment) => {
    // Navigate to Booking page with appointment data
    navigate('/Booking', { state: { appointment } });
  };

  if (isLoading) {
    return <BackgroundCanvas message="Loading appointments..." />;
  }

  if (error) {
    return <BackgroundCanvas message={`Error: ${error}`} isError={true} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Appointments</h1>
          
          {appointments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No appointments scheduled
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.timeSlot}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.isConfirmed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.isConfirmed ? 'Confirmed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(appointment)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <BsPencilFill className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <BsTrashFill className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};