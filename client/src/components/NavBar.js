// NavBar.js
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'
import SignUp from './SignUp';
import LogIn from './LogIn'

const NavBar = () => {

  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    // Handle the search logic here, e.g., send a request to the server
    console.log('Searching for:', searchTerm);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  return (
    <div className="navbar">
       <Link to="/">
         <div className="logo">
          <img src="/Assets/logg.png" alt="Logo" />
        </div> 
      </Link> 

      <div className="search-bar">
        
        <button onClick={handleSearch}>Q</button>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
        />
      </div> 

      <div className="nav-links">
        <Link to="/">Home</Link>
        <button className="signup-button" onClick={openSignUpModal}>Sign Up</button>
        <button className="login-button" onClick={openLoginModal}>Login</button>
        <Link to="/Task">Tasks</Link> 
        <Link to="/About">About</Link>
      </div>

      {isSignUpModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <SignUp onClose={closeSignUpModal} />
          </div>
        </div>
      )}

      {isLoginModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <LogIn onRequestClose={closeLoginModal} />
         </div>
       </div>
      )}

    </div>
  );
};

export default NavBar;
