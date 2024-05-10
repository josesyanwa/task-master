import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Dashboard.css';

const Dashboard = ({ username, email, profilePicture, userId, userRole }) => {
  const [tasksData, setTasksData] = useState([]);
  const [totalTasksCompleted, setTotalTasksCompleted] = useState(0);
  const [totalTasksIncomplete, setTotalTasksIncomplete] = useState(0);
  const [taskNotifications, setTaskNotifications] = useState([]);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        // Fetch users' data
        const usersResponse = await fetch('/users');
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users data');
        }
        const usersData = await usersResponse.json();
        const userEmails = usersData.map(user => user.email);
  
        // Fetch tasks data
        let allTasks = [];
        let currentPage = 1;
        let totalPages = 1;
  
        while (currentPage <= totalPages) {
          const response = await fetch(`/tasks?user_id=${userId}&page=${currentPage}`);
          if (!response.ok) {
            throw new Error('Failed to fetch task data');
          }
          const data = await response.json();
          allTasks = allTasks.concat(data.tasks);
          totalPages = data.total_pages;
          currentPage++;
          console.log(`Fetched tasks from page ${currentPage}/${totalPages}`);
        }
  
        // Filter tasks where collaborator email is in the list of user emails
        const filteredTasks = allTasks.filter(task => userEmails.includes(task.collaborator_email));
  
        const completedTasks = filteredTasks.filter(task => task.progress === 100);
        setTotalTasksCompleted(completedTasks.length);
        setTotalTasksIncomplete(filteredTasks.length - completedTasks.length);
  
        setTasksData(filteredTasks);
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };
  
    fetchAllTasks();
  }, [userId]);
  
  useEffect(() => {
    const fetchTaskNotifications = async () => {
      try {
        // Fetch tasks for the user
        const response = await fetch(`/tasks?user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const tasks = await response.json();
        
        // Filter completed tasks
        const completedTasks = tasks.filter(task => task.progress === 100);
        
        // Filter overdue tasks
        const overdueTasks = tasks.filter(task => {
          const submissionDate = new Date(task.submissionDate);
          const today = new Date();
          return submissionDate < today && task.progress < 100;
        });
        
        // Generate notifications based on completed and overdue tasks
        const notifications = [];
        completedTasks.forEach(task => {
          notifications.push({
            type: 'completed',
            message: `Task "${task.title}" has been completed.`,
            taskId: task.id
          });
        });
        overdueTasks.forEach(task => {
          notifications.push({
            type: 'overdue',
            message: `Task "${task.title}" is overdue.`,
            taskId: task.id
          });
        });
        
        setTaskNotifications(notifications);
      } catch (error) {
        console.error('Error fetching tasks and generating notifications:', error);
        // Handle the error gracefully, e.g., display a message to the user
      }
    };
  
    fetchTaskNotifications();
  }, [userId]);
  

  return (
    <div className="dashboard">
  
      <div className="task-cards">
        <div className="task-card">
          <h3>Total Tasks Completed</h3>
          <p>{totalTasksCompleted}</p>
        </div>
        <div className="task-card">
          <h3>Total Tasks Incomplete</h3>
          <p>{totalTasksIncomplete}</p>
        </div>
        <div className="task-card">
          <h3>% of Tasks Completed</h3>
          <p>{totalTasksCompleted === 0 ? '0%' : ((totalTasksCompleted / tasksData.length) * 100).toFixed(2) + '%'}</p>
        </div>
      </div>
      {userRole === 'owner' && (
        <div className="notification-section">
          <h3>Task Notifications</h3>
          <ul>
            {taskNotifications.map(notification => (
              <li key={notification.id}>{notification.message}</li>
            ))}
          </ul>
        </div>
      )}
      {userRole !== 'owner' && (
        <div className="notification-section">
        <h3>{userRole === 'owner' ? 'Task Notifications' : 'Your Notifications'}</h3>
        <ul>
          {taskNotifications.map((notification, index) => (
            <li key={index}>{notification.message}</li>
          ))}
        </ul>
      </div>
      )}
      <div className="chart-card">
        <h3>Task Progress</h3>
        <BarChart width={400} height={300} data={tasksData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="progress" stackId="a" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default Dashboard;
