import React, { useState, useEffect } from 'react';
import { useUser } from '../../../Context/UserContext';
import { BackgroundCanvas } from '../../BackgroundCanvas';
import useAvailabilityViewModel from './AvailabilityViewModel';

export const DoctorAvailability = () => {
  const { getUserId } = useUser();
  const doctorId = getUserId();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    isLoading,
    error,
    successMessage,
    addAvailability,
    clearMessages
  } = useAvailabilityViewModel();

  const handleDateSelect = (date) => {
    setSelectedDates(prev => {
      if (prev.includes(date.toISOString().split('T')[0])) {
        return prev.filter(d => d !== date.toISOString().split('T')[0]);
      } else {
        return [...prev, date.toISOString().split('T')[0]];
      }
    });
  };

  const isDateSelected = (date) => {
    return selectedDates.includes(date.toISOString().split('T')[0]);
  };

  const handleTimeSelect = (time) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else {
        return [...prev, time];
      }
    });
  };

  const handleSaveAvailability = async () => {
    if (selectedTimeSlots.length === 0 || selectedDates.length === 0) return;

    setIsSaving(true);
    clearMessages();

    try {
      await addAvailability(doctorId, selectedDates, selectedTimeSlots);
      
      // Clear the selection
      setSelectedDates([]);
      setSelectedTimeSlots([]);
    } catch (err) {
      console.error('Error saving availability:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const formatSelectedDates = () => {
    if (selectedDates.length === 0) return '';
    return selectedDates.map(date => new Date(date).toLocaleDateString()).join(', ');
  };

  const handleAddTimeSlot = async (date, timeSlot) => {
    try {
      // Here you would make an API call to add a time slot
      console.log('Adding time slot:', {
        doctorId,
        date,
        timeSlot
      });

      // Update local state
      setAvailability(prev => prev.map(avail => 
        avail.date === date 
          ? { ...avail, timeSlots: [...avail.timeSlots, timeSlot] }
          : avail
      ));
    } catch (error) {
      console.error('Error adding time slot:', error);
      alert('Failed to add time slot. Please try again.');
    }
  };

  return (
    <BackgroundCanvas section={
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Availability</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Calendar</h2>
            <div className="mb-4 flex justify-between items-center">
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 rounded hover:bg-gray-100"
              >
                &lt;
              </button>
              <span className="text-lg font-medium">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 rounded hover:bg-gray-100"
              >
                &gt;
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }, (_, i) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                const currentTime = new Date();
                const isPast6PM = currentTime.getHours() >= 18;
                const isToday = date.toDateString() === currentTime.toDateString();
                const isDisabled = date < new Date(new Date().setHours(0,0,0,0)) || (isToday && isPast6PM);
                const isSelected = isDateSelected(date);

                return (
                  <button
                    key={i}
                    onClick={() => handleDateSelect(date)}
                    className={`p-2 rounded-full ${
                      isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    } ${
                      isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isDisabled}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Selected Dates</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Time Slots</h2>
            {selectedDates.length > 0 ? (
              <>
                <p className="text-gray-600 mb-4">Selected Dates: {formatSelectedDates()}</p>
                <div className="grid grid-cols-2 gap-2">
                  {generateTimeSlots().map(time => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-2 rounded ${
                        selectedTimeSlots.includes(time)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSaveAvailability}
                  disabled={isSaving || selectedTimeSlots.length === 0}
                  className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Availability'}
                </button>
              </>
            ) : (
              <p className="text-gray-600">Please select dates first</p>
            )}
          </div>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}
      </div>
    }/>
  );
}; 