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
      
      const formattedAppointments = data.map(appt => ({
        email: appt.email,
        date: appt.Date,
        time: appt.Time,
        doctor: appt.DoctorName || 'Dr. Jacob Jones',
        reason: appt.Reason
      }));
      setAppointments(formattedAppointments);
      setError(null);
    } catch (err) {
      setError(err.message);
      setAppointments([]);
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