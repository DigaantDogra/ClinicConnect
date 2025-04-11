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
        Id: appointmentData.id,
        Date: formattedDate,
        Time: appointmentData.time,
        Reason: appointmentData.reason,
        Day: new Date(appointmentData.date).toLocaleDateString('en-US', { weekday: 'long' }),
        Email: "example@example.com"
      };

      let response;
      if (appointmentData.id) {
        // If there's an ID, it's an edit operation
        response = await ApiService.editAppointment(appointment);
      } else {
        // If no ID, it's a new appointment
        response = await ApiService.createAppointment(appointment);
      }

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