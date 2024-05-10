import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Home.css'; 

function Home({ userData }) {
  
  const navigate = useNavigate(); 

  

  const handleGetAccountClick = () => {
    
    navigate('/signup');
  };

  const handleLearnMoreClick = () => {
    
    navigate('/about');
  };

  console.log(userData);

  return (
    <div className="home-container">
      <div className="description-container">
        <h1>Organise your tasks.</h1>
        <p>Do you have many unorganised tasks?You'll get the help that you want here.</p>
        <div className="buttons-container">
          <button className="get-account-button" onClick={handleGetAccountClick}>Get Free Account</button>
          <button className="learn-more-button" onClick={handleLearnMoreClick}>Learn More</button>
        </div>
      </div>
      <div className="image-container">
          (
          <div>
             <img
              src="./Assets/todo2.jpg"
              alt="Home Page Img"
              style={{ maxWidth: '100%', height: 'auto' }}
            /> 
           
          </div>
        )
      </div> 
    </div>
  );
}

export default Home;
