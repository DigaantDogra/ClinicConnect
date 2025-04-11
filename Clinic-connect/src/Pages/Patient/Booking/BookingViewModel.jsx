import { useState, useCallback } from 'react';
import ApiService from '../../../Service/ApiService';

const useBookingViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitBooking = useCallback(async (appointmentData) => {
    setIsLoading(true);
    try {
      console.log('BookingViewModel.jsx - Received appointment data:', appointmentData);
      
      const formattedDate = new Date(appointmentData.date).toISOString().split('T')[0];
      const appointment = {
        Date: formattedDate,
        Time: appointmentData.time,
        Reason: appointmentData.reason,
        Day: new Date(appointmentData.date).toLocaleDateString('en-US', { weekday: 'long' }),
        Email: "example@example.com" // This should be replaced with actual user email
      };

      console.log('BookingViewModel.jsx - Formatted appointment:', appointment);
      const response = await ApiService.createAppointment(appointment);
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