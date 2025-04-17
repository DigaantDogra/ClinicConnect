import { useState, useCallback } from 'react';
import ApiService from '../../../Service/ApiService';

export const useBookingViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState({});

  const fetchDoctorAvailability = useCallback(async (doctorId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting to fetch availability for doctor:', doctorId);
      const data = await ApiService.getDoctorAvailabilities(doctorId);
      console.log('Raw API response:', JSON.stringify(data, null, 2));
      
      if (!Array.isArray(data)) {
        console.error('API response is not an array:', data);
        throw new Error('Invalid response format from server');
      }

      // Transform the availability data into a more usable format
      const formattedAvailability = {};
      data.forEach(avail => {
        console.log('Processing availability:', avail);
        
        // Skip if availability is not available or missing required fields
        if (!avail || !avail.isAvailable || !avail.dates || !avail.timeSlots) {
          console.log('Skipping invalid availability:', avail);
          return;
        }

        // Process each date in the Dates list
        avail.dates.forEach(date => {
          if (!date) {
            console.log('Skipping invalid date');
            return;
          }

          if (!formattedAvailability[date]) {
            formattedAvailability[date] = [];
          }
          
          // Add all time slots for this date
          avail.timeSlots.forEach(timeSlot => {
            if (!timeSlot) {
              console.log('Skipping invalid time slot');
              return;
            }

            if (!formattedAvailability[date].includes(timeSlot)) {
              formattedAvailability[date].push(timeSlot);
              console.log(`Added time slot ${timeSlot} for date ${date}`);
            }
          });
        });
      });
      
      // Sort time slots for each date
      Object.keys(formattedAvailability).forEach(date => {
        formattedAvailability[date].sort((a, b) => {
          // Convert time strings to minutes for comparison
          const timeToMinutes = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
          };
          return timeToMinutes(a) - timeToMinutes(b);
        });
      });
      
      console.log('Final formatted availability:', JSON.stringify(formattedAvailability, null, 2));
      setAvailability(formattedAvailability);
      return formattedAvailability;
    } catch (err) {
      console.error('Error in fetchDoctorAvailability:', err);
      setError(err.message || 'Failed to fetch doctor availability');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAppointment = useCallback(async (appointmentData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Creating new appointment:', appointmentData);
      
      // Validate required fields for new appointment
      if (!appointmentData.doctorId || !appointmentData.date || !appointmentData.timeSlot || !appointmentData.reason) {
        throw new Error('Missing required appointment information');
      }

      // Generate a unique ID if not provided
      if (!appointmentData.id) {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 8);
        appointmentData.id = `appt-${timestamp}-${randomStr}`;
      }

      const response = await ApiService.createAppointment(appointmentData);
      console.log('Appointment created successfully:', response);
      return true;
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err.message || 'Failed to create appointment');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAppointment = useCallback(async (appointmentId, appointmentData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Updating appointment:', appointmentId, appointmentData);
      
      // Validate required fields for update
      if (!appointmentData.patientId || !appointmentData.doctorId || 
          !appointmentData.date || !appointmentData.timeSlot || !appointmentData.reason) {
        throw new Error('Missing required appointment information');
      }

      const response = await ApiService.updateAppointment(appointmentId, appointmentData);
      console.log('Appointment updated successfully:', response);
      return true;
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError(err.message || 'Failed to update appointment');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    availability,
    fetchDoctorAvailability,
    createAppointment,
    updateAppointment
  };
};

export default useBookingViewModel;