import { useState, useCallback } from 'react';
import ApiService from '../../../Service/ApiService';

const useAvailabilityViewModel = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchAvailabilities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching doctor availabilities...');
      const data = await ApiService.getDoctorAvailabilities();
      console.log('Raw API Response:', data);
      
      if (!Array.isArray(data)) {
        console.error('API response is not an array:', data);
        throw new Error('Invalid response format from server');
      }

      const formattedAvailabilities = data.map(avail => ({
        id: avail.id,
        date: new Date(avail.date),
        timeSlot: avail.timeSlot,
        isAvailable: avail.isAvailable
      }));
      
      console.log('Formatted Availabilities:', formattedAvailabilities);
      setAvailabilities(formattedAvailabilities);
    } catch (err) {
      console.error('Error in fetchAvailabilities:', err);
      setError(err.message);
      setAvailabilities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addAvailability = useCallback(async (date, timeSlot) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      console.log('Adding availability for:', { date, timeSlot });
      const availability = {
        date: date.toISOString().split('T')[0],
        timeSlot: timeSlot,
        isAvailable: true
      };

      const result = await ApiService.addAvailability(availability);
      console.log('Availability added successfully:', result);
      
      setSuccessMessage('Availability added successfully');
      // Refresh the availabilities list
      await fetchAvailabilities();
    } catch (err) {
      console.error('Error in addAvailability:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAvailabilities]);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    availabilities,
    isLoading,
    error,
    successMessage,
    fetchAvailabilities,
    addAvailability,
    clearMessages
  };
};

export default useAvailabilityViewModel;
