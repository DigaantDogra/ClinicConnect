import React, { useEffect } from 'react';
import useAppointmentViewModel from './AppointmentViewModel';
import { useNavigate } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs"
import { BackgroundCanvas } from '../../BackgroundCanvas';

// Mock doctor ID for testing - replace this with actual auth later
const MOCK_DOCTOR_ID = 'doctor-123';

export const DoctorAppointment = () => {
  const { appointments, isLoading, error, fetchAppointments, approveAppointment } = useAppointmentViewModel();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments(MOCK_DOCTOR_ID);
  }, [fetchAppointments]);

  const handleApprove = async (appointmentId) => {
    try {
      await approveAppointment(appointmentId, MOCK_DOCTOR_ID);
      // The appointments list will be automatically refreshed by the view model
    } catch (err) {
      console.error('Error approving appointment:', err);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    if (status === 'confirmed') {
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
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(appointment.id)}
                          className="text-green-500 text-xl/snug hover:text-green-700"
                          title="Approve Appointment"
                        >
                          <BsCheckCircleFill />
                        </button>
                      )}
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