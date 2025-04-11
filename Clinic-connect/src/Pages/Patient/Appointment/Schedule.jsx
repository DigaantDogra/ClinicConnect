import { BackgroundCanvas } from "../../BackgroundCanvas";
import { Link } from "react-router-dom";
import { useEffect } from 'react';
import useScheduleViewModel from './ScheduleViewModel';
import { BsTrashFill , BsPencilFill } from "react-icons/bs"

export const Schedule = () => {
  const { appointments, isLoading, error, fetchAppointments, deleteAppointment } = useScheduleViewModel();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleDeleteClick = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      await deleteAppointment(appointmentId);
    }
  };

  if (isLoading) return <BackgroundCanvas section={<div>Loading appointments...</div>} />;
  if (error) return <BackgroundCanvas section={<div>Error: {error}</div>} />;

  return (
    <BackgroundCanvas section={
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-end">
          <Link to={"/Search"}>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.doctor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleDeleteClick(appointment.id)}
                      className="text-red-500 text-xl/snug hover:text-red-700"
                    >
                      <BsTrashFill />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      // onClick={() => handleDeleteClick(appointment.id)}
                      className="text-blue-500 text-xl/snug hover:text-blue-700"
                    >
                      <BsPencilFill />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    }/>
  );
}