import { Link } from "react-router-dom";
import { BackgroundCanvas } from "../../BackgroundCanvas"
import { useState, useEffect } from 'react';

export const Booking = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availability, setAvailability] = useState({});

  // Simulate fetching availability data (replace with API call)
  useEffect(() => {
    // Generate random availability for demonstration
    const fakeAvailability = {};
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Generate available dates (excluding weekends and random days)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() !== 0 && date.getDay() !== 6 && Math.random() > 0.3) {
        fakeAvailability[date.toISOString().split('T')[0]] = generateTimeSlots();
      }
    }
    
    setAvailability(fakeAvailability);
  }, [currentDate]);

  const generateTimeSlots = () => {
    return [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
      '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
      '03:00 PM', '03:30 PM', '04:00 PM'
    ];
  };

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
    if (!date.currentMonth || date.isPast || !availability[date.isoDate]) return;
    setSelectedDate(date.isoDate);
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset,
      1
    ));
  };

  return ( <BackgroundCanvas section={
    <div className="flex justify-between items-start mt-7">
    <div className="max-w-xl ml-10 p-6 space-y-6">
      {/* ... (keep existing header and doctor details sections) ... */}

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
            const isAvailable = availability[date.isoDate] && !date.isPast;
            const isSelected = selectedDate === date.isoDate;
            
            return (
              <div
                key={index}
                onClick={() => handleDateSelect(date)}
                className={`
                  min-h-[60px] p-2 bg-white hover:bg-gray-50 cursor-pointer
                  ${!date.currentMonth ? 'text-gray-400' : ''}
                  ${date.isPast ? 'bg-gray-100 cursor-not-allowed' : ''}
                  ${isAvailable ? 'hover:bg-green-50' : ''}
                  ${isSelected ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm">{date.date}</span>
                  {isAvailable && (
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-1" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
    </div>
    </div>

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
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Reason for Appointment"
            rows={10}
          />
        </div>

        <Link to={"/Schedule"} className="items-center">
          <h1 className="items-center mt-17 bg-blue-500 max-w-25 p-3 text-white rounded-2xl hover:translate-y-0.5 transition-all">Book Now</h1>
        </Link>
      </div>
      

    </div>
  }/>
  );
};
