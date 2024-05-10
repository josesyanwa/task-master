// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';


const Login = ({  onRequestClose, onSuccessLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const userFormData = { username, password };
    console.log('Form Data:', userFormData);

    fetch("http://127.0.0.1:5555/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userFormData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then((user) => {
        localStorage.setItem("JWT",user.access_token)
        navigate('/Task', { state: { username } }); // Pass username to Task component
        onRequestClose();

        // onSuccessLogin(username);
      })
      .catch((error) => {
        setError('Login failed. Please check your credentials.');
        console.error('Login error:', error);
      });
  };

  const handleNameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className="login-container">
      <div>
        <button className="close-button" onClick={onRequestClose}>
          &times; {/* "x" character for a cross icon */}
        </button>
      </div>
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={handleNameChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
