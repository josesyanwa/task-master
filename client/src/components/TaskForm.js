import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './TaskForm.css';

Modal.setAppElement('#root');

const TaskForm = ({ projectId, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: '',
    progress: '',
    project_id: '',
    collaborator_email: '' 
  });

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      project_id: projectId
    }));
  }, [projectId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${localStorage.getItem('JWT')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const responseData = await response.json();
      console.log('New task added:', responseData);

      // Notify User 2
      await fetch(`/notify/${formData.collaborator_email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${localStorage.getItem('JWT')}`
        },
        body: JSON.stringify({ message: `You have been added as a collaborator to the task: ${formData.title}` })
      });

      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <Modal appElement={document.getElementById('root')} isOpen={true} onRequestClose={onClose}>
      <div className="task-form">
        <h2>Add Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="priority">Priority:</label>
            <select name="priority" value={formData.priority} onChange={handleInputChange}>
              <option value="">Select Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="progress">Progress:</label>
            <select name="progress" value={formData.progress} onChange={handleInputChange}>
              <option value="">Select Progress</option>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value, index) => (
                <option key={index} value={value}>{value}%</option>
              ))}
            </select>
          </div>
          <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
          <input type="date" name="due_date" placeholder="Due Date" value={formData.due_date} onChange={handleInputChange} />
          <input type="text" name="project_id" placeholder="Project ID" value={formData.project_id} readOnly />
          <input type="text" name="collaborator_email" placeholder="Collaborator Email" value={formData.collaborator_email} onChange={handleInputChange} />
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </Modal>
  );
};

export default TaskForm;