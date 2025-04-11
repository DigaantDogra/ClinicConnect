import { useState, useCallback } from 'react';
import ApiService from '../../../Service/ApiService';

const useBookingViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitBooking = useCallback(async (appointmentData) => {
    setIsLoading(true);
    try {
      const appointment = {
        Date: appointmentData.date,
        Day: new Date(appointmentData.date).toLocaleDateString('en-US', { weekday: 'long' }),
        Time: appointmentData.time,
        Reason: appointmentData.reason,
        Email: "example@example.com" // This should be replaced with actual user email
      };
      
      console.log('Sending appointment data:', appointment);
      await ApiService.createAppointment(appointment);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error in submitBooking:', err);
      setError(err.message);
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