import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAppointmentViewModel from "./AppointmentViewModel";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

const MOCK_DOCTOR_ID = 'doctor-123';

export const DoctorAppointment = () => {
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    updateAppointmentStatus,
    deleteAppointment
  } = useAppointmentViewModel();

  useEffect(() => {
    if (MOCK_DOCTOR_ID) {
      fetchAppointments(MOCK_DOCTOR_ID);
    }
  }, [MOCK_DOCTOR_ID, fetchAppointments]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      await fetchAppointments(doctorId);
      setShowConfirmModal(false);
      setShowCancelModal(false);
    } catch (err) {
      console.error(`Error ${newStatus === "confirmed" ? "confirming" : "cancelling"} appointment:`, err);
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
    
    try {
      await deleteAppointment(selectedAppointment.id);
      await fetchAppointments(doctorId);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  const handleActionClick = (appointment, type) => {
    setSelectedAppointment(appointment);
    switch (type) {
      case "confirm":
        setShowConfirmModal(true);
        break;
      case "cancel":
        setShowCancelModal(true);
        break;
      case "delete":
        setShowDeleteModal(true);
        break;
      default:
        break;
    }
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
                    <div className="flex space-x-2">
                      {appointment.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleActionClick(appointment, "confirm")}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                            title="Confirm Appointment"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleActionClick(appointment, "cancel")}
                            className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full"
                            title="Cancel Appointment"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleActionClick(appointment, "delete")}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                        title="Delete Appointment"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Confirm Appointment</h3>
              <p className="mb-4">Are you sure you want to confirm this appointment?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedAppointment.id, "confirmed")}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Cancel Appointment</h3>
              <p className="mb-4">Are you sure you want to cancel this appointment?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  No
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedAppointment.id, "cancelled")}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Delete Appointment</h3>
              <p className="mb-4">Are you sure you want to delete this appointment? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};