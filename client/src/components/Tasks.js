import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import MyTask from './MyTask';
import './Task.css';
import Project from './Project';
import Calendar from './Calendar';
import Logout from './Logout';

const Task = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const location = useLocation();
  const { username } = location.state || {}; 

  const handleSidebarItemClick = (page) => {
    setCurrentPage(page);
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Africa/Nairobi'
    };
    return currentDate.toLocaleString('en-US', options);
  };

  

  return (
    <div className="container">
      <Sidebar onItemClick={handleSidebarItemClick} />
      <div className="main-content">
        {/* Display personalized welcome message */}
        <h2>Welcome {username}</h2>
        <p className="current-date">{getCurrentDate()}</p>

        {/* Rendering components based on currentPage */}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'tasks' && <MyTask />} {/* Render MyTask component */}
        {currentPage === 'project' && <Project />}
        {currentPage === 'calendar' && <Calendar />}
        {currentPage === 'Logout' && <Logout />}
      </div>
    </div>
  );
};

export default Task;
