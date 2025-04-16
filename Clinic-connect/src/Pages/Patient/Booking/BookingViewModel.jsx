import { useState, useCallback } from 'react';
import ApiService from '../../../Service/ApiService';

const useBookingViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitBooking = useCallback(async (appointmentData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Submitting booking:', appointmentData);
      
      // Format the appointment data according to the new model
      const formattedAppointment = {
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
        date: appointmentData.date,
        timeSlot: appointmentData.timeSlot,
        reason: appointmentData.reason
      };

      const result = await ApiService.createAppointment(formattedAppointment);
      console.log('Booking successful:', result);
      setSuccess(true);
      return result;
    } catch (err) {
      console.error('Error in submitBooking:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    success,
    submitBooking
  };
};

export default useBookingViewModel;