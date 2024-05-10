import React, { useState, useEffect } from 'react';
import './MyTask.css'; // Import MyTask.css for styling
import Comment from './Comment';

const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); // Track the selected task
  const [editedTask, setEditedTask] = useState(null); // Track the task being edited

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/tasks/collaborator', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('JWT')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        
        const responseData = await response.json();
        setTasks(responseData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleCommentClick = (task) => {
    setSelectedTask(task); // Set the selected task when the comment button is clicked
  };

  const handleDeleteClick = async (taskId) => {
    try {
      const response = await fetch(`/tasks/${taskId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
  
      // Remove the deleted task from the tasks state
      setTasks(tasks.filter(task => task.id !== taskId));
      
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

const handleUpdateClick = async (task) => {
  try {
    const response = await fetch(`/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('JWT')}`
      },
      body: JSON.stringify(editedTask)
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    // No need to parse the response JSON here, as the response should be a task object
    const updatedTask = await response.json();

    // Update the tasks state with the edited task
    setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));

    console.log('Task updated successfully');
    setEditedTask(null); // Reset editedTask state after successful update
  } catch (error) {
    console.error('Error updating task:', error);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleEditClick = (task) => {
    // Create a copy of the task object to prevent mutating the original state
    const editedTaskCopy = { ...task };
    // Set the task being edited, and keep the progress field unchanged if it has a value
    if (!editedTaskCopy.progress) {
      editedTaskCopy.progress = ""; // If progress field is empty, clear it
    }
    setEditedTask(editedTaskCopy);
  };
  
  

  return (
    <div className="my-task">
      <h2>My Tasks</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Deadline</th>
            <th>Priority</th>
            <th>Progress</th>
            <th>Collaborator Email</th>
            <th>Comments</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.due_date}</td>
              <td>{task.priority}</td>
              <td>
                {editedTask && editedTask.id === task.id ? (
                  <select name="progress" value={editedTask.progress} onChange={handleInputChange}>
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <span onClick={() => handleEditClick(task)}>{task.progress}</span>
                )}
              </td>
              <td>{task.collaborator_email}</td>
              <td>
                <button onClick={() => handleCommentClick(task)}>Comments</button>
                {selectedTask && selectedTask.id === task.id && (
                  <Comment task={selectedTask} onClose={() => setSelectedTask(null)} />
                )}
              </td>
              <td>
                <button className="update-button" onClick={() => handleUpdateClick(task)}>Update</button>
                <button className="delete-button" onClick={() => handleDeleteClick(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  
};

export default MyTask;