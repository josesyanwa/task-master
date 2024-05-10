import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import ProjectTask from './ProjectTask';
import './project.css';

const Project = () => {
    const [showForm, setShowForm] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        project_name: '',
        deadline: ''
    });
    const [projects, setProjects] = useState([]);
    const [showProjectTask, setShowProjectTask] = useState(true); // Set to true by default

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const toggleTaskForm = (projectId) => {
        setSelectedProject(projectId);
        setShowTaskForm(!showTaskForm);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log("Input changed:", name, value);

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (formData.project_name.trim() === '') {
            console.error('Project name cannot be empty.');
            return;
        }

        fetch("http://127.0.0.1:5555/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('JWT')}` 
            },
            body: JSON.stringify(formData)
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log("Success:", data);
            setSuccessMessage(data.Message);
            
            setFormData({
                project_name: '',
                deadline: ''
            });

            // Update projects state to include the newly added project
            setProjects(prevProjects => [data, ...prevProjects]);
        })
        .catch((error) => {
            console.error('Error:', error);
            setSuccessMessage("Error occurred while submitting the form.");
        });
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5555/projects/user", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('JWT')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Sort projects array based on creation or update timestamp
                const sortedProjects = data.sort((a, b) => new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at));
                setProjects(sortedProjects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="project-main">
            <button className="button" onClick={toggleForm}>Add Project</button>
            {showForm && (
                <form className="project-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="project_name"
                        placeholder="Project name"
                        value={formData.project_name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="date"
                        name="deadline"
                        placeholder="Deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                    />
                    <button type="submit">Submit</button>
                </form>
            )}


            {successMessage && <div className="success-message">{successMessage}</div>}

            <table className="project-table">
                <thead>
                    <tr>
                        <th>Project name</th>
                        <th>Deadline</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project.id}>
                            <td>{project.project_name}</td>
                            <td>{project.deadline}</td>
                            <td>
                               <button className="button-add-task" onClick={() => toggleTaskForm(project.id)}>Create Tasks</button>
                               {showTaskForm && selectedProject === project.id && <TaskForm projectId={selectedProject} onClose={() => setShowTaskForm(false)} />}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Display ProjectTask component by default */}
            {showProjectTask && <ProjectTask />}
        </div>
    );
}

export default Project;