// ProjectTask.js
import React, { useState, useEffect } from 'react';
import './ProjectTask.css';

const ProjectTask = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5555/projects-tasks/user", {
                    method: "GET", // Adding method GET
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('JWT')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="project-task-container">
            <h1 className="project-task-title">Project's Tasks</h1>
            <div className="project-cards">
                {projects.map(project => (
                    <div key={project.id} className="project-card">
                        <h2>{project.project_name}</h2>
                        <p>Deadline: {project.deadline}</p>
                        <h3>Tasks:</h3>
                        <ul>
                            {project.tasks && project.tasks.map(task => (
                                <li key={task.id}>
                                    <strong>Title:</strong> {task.title},
                                    <strong>Priority:</strong>{task.priority}
                                     <strong>Progress:</strong> {task.progress}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectTask;