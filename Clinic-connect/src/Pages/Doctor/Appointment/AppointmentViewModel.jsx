import { useState, useCallback } from 'react';
import ApiService from '../../../Service/ApiService';

const useAppointmentViewModel = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async (doctorId) => {
    if (!doctorId) {
      console.error('No doctor ID provided');
      setError('Doctor ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching appointments for doctor:', doctorId);
      const data = await ApiService.getDoctorAppointments(doctorId);
      console.log('Raw API Response:', data);
      
      if (!Array.isArray(data)) {
        console.error('API response is not an array:', data);
        throw new Error('Invalid response format from server');
      }

      // Create an array to store appointments with patient names
      const appointmentsWithPatientNames = [];
      
      // Process each appointment sequentially
      for (const appt of data) {
        try {
          console.log('Fetching patient name for appointment:', appt.id);
          const patientName = await ApiService.getPatientName(appt.patientId);
          console.log('Patient name fetched:', patientName);
          
          appointmentsWithPatientNames.push({
            id: appt.id,
            date: appt.date || 'N/A',
            timeSlot: appt.timeSlot || 'N/A',
            patientId: appt.patientId || 'N/A',
            patientName: patientName || 'Unknown Patient',
            reason: appt.reason || 'N/A',
            status: appt.isConfirmed ? 'confirmed' : 'pending'
          });
        } catch (err) {
          console.error('Error fetching patient name for appointment:', appt.id, err);
          // Add appointment with unknown patient name
          appointmentsWithPatientNames.push({
            ...appt,
            patientName: 'Unknown Patient',
            status: appt.isConfirmed ? 'confirmed' : 'pending'
          });
        }
      }
      
      console.log('Formatted Appointments with Patient Names:', appointmentsWithPatientNames);
      setAppointments(appointmentsWithPatientNames);
      setError(null);
    } catch (err) {
      console.error('Error in fetchAppointments:', err);
      setError(err.message);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approveAppointment = useCallback(async (appointmentId, doctorId) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Approving appointment:', appointmentId);
      await ApiService.approveAppointment(appointmentId);
      // Refresh appointments after approval
      await fetchAppointments(doctorId);
    } catch (err) {
      console.error('Error approving appointment:', err);
      setError('Failed to approve appointment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAppointments]);

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    approveAppointment
  };
};

export default useAppointmentViewModel;
