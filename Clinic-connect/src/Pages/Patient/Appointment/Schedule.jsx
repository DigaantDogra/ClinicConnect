import React, { useEffect } from 'react';
import useScheduleViewModel from './ScheduleViewModel';
import { Link, useNavigate } from "react-router-dom";
import { BsTrashFill, BsPencilFill } from "react-icons/bs"

// Mock user ID for testing - replace this with actual auth later
const MOCK_USER_ID = 'test-patient-123';

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
    return <div className="flex justify-center items-center h-screen">Loading appointments...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Appointments</h1>
      
      {appointments.length === 0 ? (
        <div className="text-center text-gray-500">No appointments scheduled</div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">Appointment Details</h2>
                  <p className="text-gray-600">Date: {appointment.date}</p>
                  <p className="text-gray-600">Time: {appointment.timeSlot}</p>
                  <p className="text-gray-600">Reason: {appointment.reason}</p>
                  <p className="text-gray-600">Status: {appointment.isConfirmed ? 'Confirmed' : 'Pending'}</p>
                </div>
                <button
                  onClick={() => handleDelete(appointment.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};