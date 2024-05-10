import React from 'react';

const Sidebar = ({ onItemClick }) => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <button onClick={() => onItemClick('dashboard')}>Dashboard</button>
        </li>
        <li>
          <button onClick={() => onItemClick('tasks')}>MyTask</button>
        </li>
        <li>
          <button onClick={() => onItemClick('project')}>Project</button>
        </li>
        <li>
          <button onClick={() => onItemClick('calendar')}>Calendar</button>
        </li>
        <li>
          <button onClick={() => onItemClick('Logout')}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;