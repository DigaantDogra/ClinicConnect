import React, { useEffect } from 'react';
import { useUser } from '../../../Context/UserContext';
import useScheduleViewModel from './ScheduleViewModel';
import { Link, useNavigate } from "react-router-dom";
import { BsTrashFill, BsPencilFill } from "react-icons/bs"
import { BackgroundCanvas } from '../../BackgroundCanvas';

export const PatientSchedule = () => {
  const { getUserId } = useUser();
  const patientId = getUserId();
  const { appointments, isLoading, error, fetchAppointments, deleteAppointment } = useScheduleViewModel();
  const navigate = useNavigate();

  useEffect(() => {
    if (patientId) {
      fetchAppointments(patientId);
    }
  }, [patientId, fetchAppointments]);

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
    navigate('/Patient/Booking', { 
      state: { 
        appointment: appointment,
        isEditMode: true
      } 
    });
  };

  const getStatusBadge = (isApproved) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    if (isApproved) {
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Approved</span>;
    } else {
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
    }
  };

  if (isLoading) {
    return <BackgroundCanvas message="Loading appointments..." />;
  }

  if (error) {
    return <BackgroundCanvas message={`Error: ${error}`} isError={true} />;
  }

  return (
    <BackgroundCanvas section={
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-end">
          <Link to={"/Patient/Search"}>
            <h1 className="bg-blue-400 p-4 rounded-2xl text-white mb-3 hover:-translate-y-0.5 transition-all">
              Request Appointment
            </h1>
          </Link>
        </div>
        
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.timeSlot}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.doctorName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getStatusBadge(appointment.isConfirmed)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(appointment)}
                        className="text-blue-500 text-xl/snug hover:text-blue-700"
                        title="Edit Appointment"
                      >
                        <BsPencilFill />
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-500 text-xl/snug hover:text-red-700"
                        title="Delete Appointment"
                      >
                        <BsTrashFill />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    }/>
  );
};