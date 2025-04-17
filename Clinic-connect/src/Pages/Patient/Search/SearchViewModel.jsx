import { useState, useCallback } from 'react';
import ApiService from '../../../Service/ApiService';

const useSearchViewModel = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching all doctors');
      const data = await ApiService.getAllDoctors();
      console.log('Doctors fetched successfully:', data);
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err.message || 'Failed to fetch doctors');
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    doctors,
    isLoading,
    error,
    fetchDoctors
  };
};

export default useSearchViewModel;
