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

      // Create an array to store appointments with doctor names
      const appointmentsWithDoctorNames = [];
      
      // Process each appointment sequentially
      for (const appt of data) {
        try {
          console.log('Fetching doctor name for appointment:', appt.id);
          const doctorName = await ApiService.getDoctorName(appt.doctorId);
          console.log('Doctor name fetched:', doctorName);
          
          appointmentsWithDoctorNames.push({
            id: appt.id,
            date: appt.date || 'N/A',
            timeSlot: appt.timeSlot || 'N/A',
            doctorId: appt.doctorId || 'N/A',
            doctorName: doctorName || 'Unknown Doctor',
            reason: appt.reason || 'N/A',
            isConfirmed: appt.isConfirmed
          });
        } catch (err) {
          console.error('Error fetching doctor name for appointment:', appt.id, err);
          // Add appointment with unknown doctor name
          appointmentsWithDoctorNames.push({
            ...appt,
            doctorName: 'Unknown Doctor'
          });
        }
      }
      
      console.log('Formatted Appointments with Doctor Names:', appointmentsWithDoctorNames);
      setAppointments(appointmentsWithDoctorNames);
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
      console.log('Deleting appointment:', appointmentId);
      await ApiService.deleteAppointment(appointmentId);
      // Refresh the appointments list after successful deletion
      await fetchAppointments();
      setError(null);
    } catch (err) {
      console.error('Error in deleteAppointment:', err);
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