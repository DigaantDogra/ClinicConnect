import { useState, useCallback } from 'react';
import ApiService from '../../../Service/ApiService';

const useScheduleViewModel = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async (patientId) => {
    setIsLoading(true);
    try {
      console.log('Fetching appointments...');
      const data = await ApiService.getAppointments(patientId);
      console.log('Raw API Response:', data);
      
      if (!Array.isArray(data)) {
        console.error('API response is not an array:', data);
        throw new Error('Invalid response format from server');
      }

      const formattedAppointments = data.map(appt => {
        console.log('Processing appointment:', appt);
        return {
          id: appt.id,
          date: appt.date || 'N/A',
          timeSlot: appt.timeSlot || 'N/A',
          doctorId: appt.doctorId || 'N/A',
          reason: appt.reason || 'N/A',
          isConfirmed: appt.isConfirmed
        };
      });
      
      console.log('Formatted Appointments:', formattedAppointments);
      setAppointments(formattedAppointments);
      setError(null);
    } catch (err) {
      console.error('Error in fetchAppointments:', err);
      setError(err.message);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAppointment = useCallback(async (appointmentId) => {
    setIsLoading(true);
    try {
      await ApiService.deleteAppointment(appointmentId);
      // Refresh the appointments list after successful deletion
      await fetchAppointments();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAppointments]);

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    deleteAppointment
  };
};

export default useScheduleViewModel;