import React, { useState, useEffect } from 'react';
import './Comment.css'; // Import the CSS file for styling

const Comment = ({ task, userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`
        },
        body: JSON.stringify({
          text: newComment,
          task_id: task.id,
          user_id: userId // Include the user ID here
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      setComments([...comments, data]); // Add the new comment to the comments state
      setNewComment(''); // Clear the comment input field
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Fetch comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/comments/${task.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('JWT')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }

        const data = await response.json();
        setComments(data); // Update the comments state
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [task.id]); // Run this effect whenever the task ID changes

  return (
    <div className="comment-container">
      <button className="comment-button" onClick={handleToggleModal}>Comments</button>
      {showModal && (
        <div className="comment-modal">
          <div className="comment-modal-content">
            <h3>Comments for {task.title}</h3>
            <span className="comment-close" onClick={handleToggleModal}>×</span>
            {/* Display fetched comments */}
            <ul>
              {console.log("Comments:", comments)}
              {comments.map((comment) => (
                <li key={comment.id}>
                  <strong>{comment.author}</strong>: {comment.text} {/* Display author's name */}
                </li>
              ))}
            </ul>
            {/* Comment form */}
            <form onSubmit={handleSubmitComment}>
              {/* Comment input field */}
              <textarea value={newComment} onChange={handleCommentChange} placeholder="Add comment..."></textarea>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
