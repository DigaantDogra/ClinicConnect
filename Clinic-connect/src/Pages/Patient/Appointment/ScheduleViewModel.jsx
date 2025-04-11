import { useState, useCallback } from 'react';
import ApiService from '../../../Service/ApiService';

const useScheduleViewModel = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ApiService.getAppointments();
      // Transform API data to match table structure
      const formattedAppointments = data.map(appt => ({
        date: new Date(appt.Date).toLocaleDateString(),
        time: appt.Time,
        doctor: appt.DoctorName || 'Dr. Jacob Jones', // Update with actual doctor field
        reason: appt.Reason || 'Mumps Stage II'       // Update with actual reason field
      }));
      setAppointments(formattedAppointments);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments
  };
};

export default useScheduleViewModel;