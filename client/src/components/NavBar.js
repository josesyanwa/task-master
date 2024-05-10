// NavBar.js
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'
import SignUp from './SignUp';
import LogIn from './LogIn'

const NavBar = () => {

  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  

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
          <img src="/Assets/logg.jpeg" alt="Logo" />
        </div> 
      </Link> 

      

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
