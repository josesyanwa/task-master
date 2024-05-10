import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

import './SignUp.css';

const Signup = ({ onClose }) => {
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user' 
  });

  const navigate = useNavigate(); 

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();

    // Check if any field is empty
    if (Object.values(userFormData).some(value => value === '')) {
      alert('Please fill in all fields');
      return;
    }

    console.log('Form Data:', userFormData);

    fetch("http://127.0.0.1:5555/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userFormData), 
    })
      .then((r) => r.json())
      .then((user) => {

        localStorage.setItem("JWT",user.access_token)
        
        navigate('/'); 

        onClose();
      })
      .catch(error => {
        console.error('Error:', error);
        
      });
  };

  return (
    <div className="signup-modal">
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <h2>Sign Up</h2>
      <form onSubmit={handleUserSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Name"
          value={userFormData.username}
          onChange={handleUserChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userFormData.password}
          onChange={handleUserChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userFormData.email}
          onChange={handleUserChange}
        />
        <select
          name="role"
          value={userFormData.role}
          onChange={handleUserChange}
        >
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>
        
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
