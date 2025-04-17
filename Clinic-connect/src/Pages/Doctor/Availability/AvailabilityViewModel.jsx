import { useState, useCallback } from 'react';
import ApiService from '../../../Service/ApiService';

const useAvailabilityViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const addAvailability = useCallback(async (doctorId, dates, timeSlots) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      console.log('Adding availability for:', { doctorId, dates, timeSlots });
      const availabilityId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const availability = {
        id: availabilityId,
        doctorId: doctorId,
        dates: dates,
        timeSlots: timeSlots,
        isAvailable: true
      };

      const result = await ApiService.addAvailability(availability);
      console.log('Availability added successfully:', result);
      
      setSuccessMessage('Availability added successfully');
    } catch (err) {
      console.error('Error in addAvailability:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAvailability = useCallback(async (availabilityId) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      console.log('Deleting availability:', availabilityId);
      await ApiService.deleteAvailability(availabilityId);
      
      setSuccessMessage('Availability deleted successfully');
    } catch (err) {
      console.error('Error in deleteAvailability:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    isLoading,
    error,
    successMessage,
    addAvailability,
    deleteAvailability,
    clearMessages
  };
};

export default useAvailabilityViewModel;
