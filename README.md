
# DJUNGLE TASK PLANNER

Djungle Task Planner is a task management application built with a React front end and a Flask back end. This README provides instructions for setting up and running the application.

# Table of Contents

 -Prerequisites

 -Installation

 -Running the Application
   -Front End
   -Back End

 -Directory Structure

 -Features

# Prerequisites

Before you begin, ensure you have the following installed:

 1. Node.js and npm (for the front end)
 2. Python and Pipenv (for the back end)

# Installation

Follow these steps to install the necessary dependencies for both the front end and back end of the application.

 # - Front End

1. Navigate to the client directory:

cd client

2. Install the dependencies:

 - npm install react-calendar
 - npm install react-modal
 - npm install react-router-dom
 - npm install recharts
 - npm install


 # Back End

1. Navigate to the server directory:

cd server

2. Install the dependencies:

pipenv install

# Running the Application

 # Front End
To run the front end of the application:

1. Navigate to the client directory (if not already there):

cd client

2. Start the development server:

npm start

The front end will be accessible at http://localhost:4001.

 # Back End
To run the back end of the application:

1. Navigate to the server directory (if not already there):

cd server

2. Activate the Pipenv shell:

pipenv shell

3. Start the Flask server:

python app.py

The back end will be accessible at  http://127.0.0.1:5555 .

# Directory Structure

Djungle-Task-Planner/
├── client/
│   ├── public/
│   ├── src/
│   │   └── components/      # React components
│   │       └── ...          # Individual React components
│   ├── package.json
│   └── ...                   # Other front end files
├── server/
│   ├── models/               # Contains the models
│   │   └── ...               # Individual model files
│   ├── app.py
│   ├── config.py
│   ├── Pipfile
│   ├── Pipfile.lock
│   └── ...                   # Other back end files
├── README.md
└── ...                       # Other project files


# Features

 # React Frontend:

1. User Registration and Authentication:

   - Registration and Login forms with fields for username, email, and password.
   - Client-side validation for form inputs.
   - Integrated with backend API endpoints for user registration and authentication.

2. Dashboard Overview:

   - Upon successful login, displays an overview dashboard showcasing task lists, deadlines, and progress.
   - Includes basic stats such as total tasks completed, overdue tasks, and upcoming deadlines.
   - Utilizes React components to visualize data in an informative and visually appealing manner.

3. Task Lists:

   - Enable users (those whose role is OWNER) to create, view, edit, and delete task lists.

4. Task Creation and Assignment:

   - Has forms for creating new tasks with fields for title, description, due date, priority, and collaborator.
   - Allow users (OWNER) to assign tasks to team members and set deadlines.

5. Task Details and Comments:

   - Allow users to view detailed information for each task, including description, due date, priority, and comments.
   - Enable users to add comments to tasks, facilitating communication and collaboration among team members.

6. Progress Tracking: 

   - Displays visual indicators of task progress, such as completion percentage and status labels.
   - Allow users to mark tasks as complete, update status, and track changes over time.


   # Python Backend

1. User Management:

 - Has API endpoints for user registration, login, and authentication using Flask routes.
 - uses JWT tokens  for securing endpoints and validating user sessions.

2. Database Integration:

 - Has  a relational database to store user information, task data, and comments.
 - Utilize SQLAlchemy ORM for interacting with the database within Flask applications.

3. Task Management API:

 - Has API endpoints for CRUD operations on tasks, task lists, and comments.
 - Implement endpoints for creating, updating, deleting tasks, assigning tasks, and adding comments.

4. Authentication Middleware:

 -Has middleware for securing API endpoints and validating user authentication using JWT tokens.



Author
Joses Syanwa