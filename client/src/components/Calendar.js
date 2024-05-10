import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './calendar.css'; 

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Calendar</h2>
      <div className="calendar-wrapper">
        <Calendar
          onChange={onChange}
          value={date}
          showNavigation={true} 
          className="react-calendar" 
        />
      </div>
    </div>
  );
};

export default MyCalendar;
