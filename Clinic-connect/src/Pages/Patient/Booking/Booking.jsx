import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBookingViewModel } from './BookingViewModel';
import { BackgroundCanvas } from "../../BackgroundCanvas"

// Mock user ID for testing - replace this with actual auth later
const MOCK_USER_ID = 'patient-123';
const MOCK_Doctor_ID = 'doctor-123';

export const PatientBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const [doctorError, setDoctorError] = useState('');
  const { isLoading, error, availability, fetchDoctorAvailability, createAppointment, updateAppointment } = useBookingViewModel();

  // Initialize doctorId and fetch availability immediately
  useEffect(() => {
    try {
      console.log('Location state:', location.state);
      
      if (location.state?.appointment) {
        const { appointment } = location.state;
        console.log('Edit mode - Appointment data:', appointment);
        setIsEditMode(true);
        setSelectedDate(appointment.date);
        setSelectedTime(appointment.timeSlot);
        setReason(appointment.reason);
        setDoctorId(appointment.doctorId);
      } else if (location.state?.doctorId) {
        console.log('New booking - Doctor ID:', location.state.doctorId);
        setDoctorId(location.state.doctorId);
      } else {
        console.error('No doctor ID provided in location state');
        setDoctorError('No doctor selected. Please go back and select a doctor.');
      }
    } catch (err) {
      console.error('Error initializing booking:', err);
      setDoctorError('Error initializing booking. Please try again.');
    }
  }, [location.state]);

  // Fetch availability whenever doctorId changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!doctorId) {
        console.log('No doctor ID available to fetch availability');
        return;
      }

      try {
        console.log('Fetching availability for doctor:', doctorId);
        const result = await fetchDoctorAvailability(doctorId);
        console.log('Availability fetch result:', result);
        setDoctorError('');
      } catch (err) {
        console.error('Error fetching doctor availability:', err);
        setDoctorError('Failed to fetch doctor availability. Please try again.');
      }
    };

    fetchAvailability();
  }, [doctorId, fetchDoctorAvailability]);

  const getCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const grid = [];
    let dayCounter = 1;

    // Previous month's days
    const prevMonthDays = firstDay === 0 ? 6 : firstDay;
    const prevMonth = new Date(year, month, 0).getDate();
    
    // Next month's days
    const totalCells = Math.ceil((daysInMonth + prevMonthDays) / 7) * 7;
    
    for (let i = 0; i < totalCells; i++) {
      if (i < prevMonthDays) {
        grid.push({ 
          date: prevMonth - prevMonthDays + i + 1,
          currentMonth: false 
        });
      } else if (dayCounter <= daysInMonth) {
        const dateObj = new Date(year, month, dayCounter);
        grid.push({
          date: dayCounter,
          currentMonth: true,
          isoDate: dateObj.toISOString().split('T')[0],
          isPast: dateObj < new Date().setHours(0,0,0,0)
        });
        dayCounter++;
      } else {
        grid.push({ 
          date: dayCounter - daysInMonth,
          currentMonth: false 
        });
        dayCounter++;
      }
    }

    return grid;
  };

  const handleDateSelect = (date) => {
    console.log('Date selected:', date);
    console.log('Availability for selected date:', availability[date.isoDate]);
    
    if (!date.currentMonth || date.isPast || !availability[date.isoDate]) {
      console.log('Date not selectable:', {
        currentMonth: date.currentMonth,
        isPast: date.isPast,
        hasAvailability: !!availability[date.isoDate]
      });
      return;
    }
    
    setSelectedDate(date.isoDate);
    setSelectedTime(''); // Reset selected time when date changes
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset,
      1
    ));
  };

  const handleBookNow = async () => {
    try {
      const appointmentData = {
        patientId: MOCK_USER_ID,
        doctorId: doctorId,
        date: selectedDate,
        timeSlot: selectedTime,
        reason: reason
      };

      let success;
      if (isEditMode) {
        success = await updateAppointment(location.state.appointment.id, appointmentData);
      } else {
        success = await createAppointment(appointmentData);
      }

      if (success) {
        navigate('/Patient/Schedule');
      }
    } catch (err) {
      console.error('Error in handleBookNow:', err);
    }
  };

  return (
    <BackgroundCanvas section={
      <div className="flex justify-between items-start mt-7">
        {doctorError ? (
          <div className="w-full text-center p-4">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              <p className="font-semibold">{doctorError}</p>
              <button
                onClick={() => navigate('/Patient/Search')}
                className="mt-2 text-blue-500 hover:text-blue-700"
              >
                Go back to doctor selection
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-xl ml-10 p-6 space-y-6">
            {/* Calendar Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-white p-4 text-center text-sm font-medium">
                    {day}
                  </div>
                ))}
                
                {getCalendarGrid().map((date, index) => {
                  const isAvailable = date.currentMonth && !date.isPast && availability[date.isoDate];
                  const isSelected = selectedDate === date.isoDate;
                  const availableSlots = isAvailable ? availability[date.isoDate].length : 0;

                  return (
                    <div
                      key={index}
                      onClick={() => handleDateSelect(date)}
                      className={`
                        p-4 text-center cursor-pointer
                        ${date.currentMonth ? 'bg-white' : 'bg-gray-50'}
                        ${isAvailable ? 'hover:bg-blue-50' : 'opacity-50 cursor-not-allowed'}
                        ${isSelected ? 'bg-blue-100 border-2 border-blue-500' : ''}
                        ${date.isPast ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <span className={`
                        ${date.currentMonth ? 'text-gray-900' : 'text-gray-400'}
                        ${isSelected ? 'font-bold' : ''}
                      `}>
                        {date.date}
                      </span>
                      {isAvailable && (
                        <div className="mt-1 text-xs text-blue-500">
                          {availableSlots} slot{availableSlots !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col mt-7">
          <div className="min-w-xl space-y-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Verify</p>
                <p className="text-sm text-gray-500 ml-4">- Certified</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">5 Years Experience</p>
            </div>
          </div>

          <div className="border-t my-6"></div>
        
          {/* Time Slot Selection */}
          {selectedDate && availability[selectedDate] && (
            <div className="min-w-xl space-y-5">
              <h4 className="font-medium">Available Time Slots</h4>
              <div className="grid grid-cols-3 gap-2">
                {availability[selectedDate].map((time, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTime(time)}
                    className={`
                      p-2 text-sm border rounded
                      ${selectedTime === time 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'hover:bg-gray-50'}
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="min-w-xl space-y-4 mt-5 mr-6">
            <h3 className="font-semibold">Reason</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Please describe the reason for your appointment"
            />
            <button
              onClick={handleBookNow}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isEditMode ? 'Update Appointment' : 'Book Now'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    }/>
  );
};
