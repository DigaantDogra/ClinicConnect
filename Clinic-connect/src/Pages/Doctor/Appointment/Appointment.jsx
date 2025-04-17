import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAppointmentViewModel from "./AppointmentViewModel";
import { FaCheck } from "react-icons/fa";

const MOCK_DOCTOR_ID = 'doctor-123';

export const DoctorAppointment = ({ doctorId }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    approveAppointment
  } = useAppointmentViewModel();

  useEffect(() => {
    if (MOCK_DOCTOR_ID) {
      fetchAppointments(MOCK_DOCTOR_ID);
    }
  }, [MOCK_DOCTOR_ID, fetchAppointments]);

  const handleApprove = async () => {
    if (!selectedAppointment) return;
    
    setIsProcessing(true);
    try {
      await approveAppointment(selectedAppointment.id, MOCK_DOCTOR_ID);
      setShowApproveModal(false);
    } catch (err) {
      console.error("Error approving appointment:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowApproveModal(true);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "confirmed":
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Confirmed</span>;
      case "pending":
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case "cancelled":
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Appointments</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Patient</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Time</th>
                <th className="py-3 px-4 text-left">Reason</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b">
                  <td className="py-3 px-4">{appointment.patientName}</td>
                  <td className="py-3 px-4">{new Date(appointment.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{appointment.timeSlot}</td>
                  <td className="py-3 px-4">{appointment.reason}</td>
                  <td className="py-3 px-4">{getStatusBadge(appointment.status)}</td>
                  <td className="py-3 px-4">
                    {appointment.status === "pending" && (
                      <button
                        onClick={() => handleApproveClick(appointment)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                        title="Approve Appointment"
                        disabled={isProcessing}
                      >
                        <FaCheck />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Approve Modal */}
        {showApproveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Approve Appointment</h3>
              <p className="mb-4">Are you sure you want to approve this appointment?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Approving..." : "Approve"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};