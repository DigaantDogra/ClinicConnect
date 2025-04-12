import { useState, useCallback } from 'react';
import ApiService from '../../../Service/ApiService';

const useBookingViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitBooking = useCallback(async (appointmentData) => {
    setIsLoading(true);
    try {
      const formattedDate = new Date(appointmentData.date).toISOString().split('T')[0];
      const appointment = {
        id: appointmentData.id || crypto.randomUUID(),
        patientEmail: "example@example.com", // This should come from authentication
        doctorEmail: appointmentData.doctorEmail,
        date: formattedDate,
        timeSlot: appointmentData.time,
        reason: appointmentData.reason,
        isConfirmed: false
      };

      await ApiService.createAppointment(appointment);
      setError(null);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    submitBooking
  };
};

export default useBookingViewModel;