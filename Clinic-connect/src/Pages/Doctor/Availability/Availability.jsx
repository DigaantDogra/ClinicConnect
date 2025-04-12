import { BackgroundCanvas } from "../../BackgroundCanvas";
import { useState } from 'react';

export const DoctorAvailability = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availability, setAvailability] = useState({});
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  const handleDateSelect = (date) => {
    if (!dateRange.start || dateRange.end) {
      // Start new range
      setDateRange({ start: date, end: null });
    } else {
      // Complete the range
      if (date < dateRange.start) {
        setDateRange({ start: date, end: dateRange.start });
      } else {
        setDateRange({ ...dateRange, end: date });
      }
    }
  };

  const isDateInRange = (date) => {
    if (!dateRange.start) return false;
    if (!dateRange.end) return date.getTime() === dateRange.start.getTime();
    return date >= dateRange.start && date <= dateRange.end;
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

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const formatDateRange = () => {
    if (!dateRange.start || !dateRange.end) return '';
    return `${dateRange.start.toLocaleDateString()} to ${dateRange.end.toLocaleDateString()}`;
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
                const isSelected = availability[date.toISOString().split('T')[0]];
                const currentTime = new Date();
                const isPast6PM = currentTime.getHours() >= 18;
                const isToday = date.toDateString() === currentTime.toDateString();
                const isDisabled = date < new Date(new Date().setHours(0,0,0,0)) || (isToday && isPast6PM);
                const isInRange = isDateInRange(date);
                const isRangeStart = dateRange.start && date.getTime() === dateRange.start.getTime();
                const isRangeEnd = dateRange.end && date.getTime() === dateRange.end.getTime();

                return (
                  <button
                    key={i}
                    onClick={() => handleDateSelect(date)}
                    className={`p-2 rounded-full hover:bg-gray-100 ${
                      isInRange ? 'bg-blue-200' : ''
                    } ${
                      isRangeStart || isRangeEnd ? 'bg-blue-500 text-white' : ''
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
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Time Slots</h2>
            {dateRange.start && dateRange.end ? (
              <div>
                <p className="text-gray-600 mb-4">Selected Date Range: {formatDateRange()}</p>
                <div className="grid grid-cols-3 gap-2">
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
                <div className="mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => {
                      // Here you would save the selected time slots for the date range
                      console.log('Selected time slots:', selectedTimeSlots);
                      console.log('For date range:', formatDateRange());
                    }}
                  >
                    Save Availability
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select dates to update availability
              </div>
            )}
          </div>
        </div>
      </div>
    }/>
  );
}; 