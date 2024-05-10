from flask import make_response, jsonify, request, session
from flask_restful import Api, Resource
from flask_cors import CORS
from config import db, app, bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.comment import Comment
from models.project import Project
from models.task import Task
from models.user import User
from sqlalchemy import func
from sqlalchemy.orm import Query
import math

CORS(app)
api = Api(app)


class Index(Resource):
    def get(self):
        return make_response(jsonify({"message": "Welcome to the API!"}), 200)
    

class Login(Resource):
    def post(self):
        data = request.get_json()

        username = data.get("username")
        password = data.get("password")

        user = User.query.filter_by(username=username).first()

        if user:
            if user.authenticate(password):
                access_token=create_access_token(identity=user.id)
                return {"access_token":access_token},201
            else:
                return {"error": "Invalid password"}, 401
        else:
            return {"error": "User not found"}, 404

class CheckSession(Resource):
    @jwt_required()
    def get(self):
        user_id=get_jwt_identity()
        # user_id = session.get("user_id")

        if user_id:
            user = User.query.get(user_id)
            if user:
                response = {
                    "id": user.id,
                    "username": user.username,
                    "role":user.role,
                }
                return response, 200
            else:
                return {"error": "User not found"}, 404
        else:
            return {"error": "Session not found"}, 404

class Signup(Resource):
    def post(self):
        data = request.get_json()
    
        # password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        new_user = User(
            username=data['username'],
            # _password_hash=password_hash,
            email=data['email'],
            role=data['role'],
        )
        new_user.password_hash=data['password']

        db.session.add(new_user)
        db.session.commit()

        access_token=create_access_token(identity=new_user.id)
        return {"access_token":access_token},201

class Logout(Resource):
    def delete(self):
        if session.get("user_id"):
            session.pop("user_id")
            return {}, 204
        else:
            return {"error": "No active session"}, 404

class Users(Resource):
    def get(self):
        all_users = User.query.all()
        users = [user.to_dict() for user in all_users]
        return make_response(jsonify(users), 200)

    def post(self):
        data = request.get_json()
        try:
            password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')

            new_user = User(
                username=data['username'],
                _password_hash=password_hash,
                email=data['email'],
                role=data['role']
            )

            db.session.add(new_user)
            db.session.commit()

            session["user_id"] = new_user.id

            return make_response(jsonify(new_user.to_dict()), 201)
        except Exception as e:
            error_message = f"An error occurred: {e}"
            print(error_message)
            return make_response(jsonify({'error': error_message}), 500)

class UsersByID(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if user:
            return make_response(jsonify(user.to_dict()), 200)
        else:
            return make_response(jsonify({'error': 'User not found'}), 404)

    def put(self, user_id):
        data = request.get_json()
        user = User.query.get(user_id)
        if user:
            try:
                if 'username' in data:
                    user.username = data['username']
                if 'password' in data:
                    password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
                    user.password = password_hash
                if 'email' in data:
                    user.email = data['email']

                db.session.commit()
                return make_response(jsonify(user.to_dict()), 200)
            except Exception as e:
                error_message = f"An error occurred: {e}"
                print(error_message)
                return make_response(jsonify({'error': error_message}), 500)
        else:
            return make_response(jsonify({'error': 'User not found'}), 404)

    def delete(self, user_id):
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response(jsonify({'message': 'User deleted successfully'}), 200)
        else:
            return make_response(jsonify({'error': 'User not found'}), 404)

class Projects(Resource):
    def get(self):
        all_projects = Project.query.all()
        projects = [project.to_dict() for project in all_projects]
        return make_response(jsonify(projects), 200)
    
    @jwt_required()
    def post(self):
        owner_id=get_jwt_identity()
        user=User.query.filter_by(id=owner_id).first()
        if user.role != "owner":
            return {"Message":"User not owner."}
        
        data = request.get_json()
        try:
            new_project = Project(
                project_name=data['project_name'],
                deadline=data.get('deadline'),
                owner_id=owner_id
            )

            db.session.add(new_project)
            db.session.commit()

            return make_response(jsonify(new_project.to_dict()), 201)
        except Exception as e:
            error_message = f"An error occurred: {e}"
            print(error_message)
            return make_response(jsonify({'error': error_message}), 500)

class ProjectsByID(Resource):
    def get(self, project_id):
        project = Project.query.get(project_id)
        if project:
            return make_response(jsonify(project.to_dict()), 200)
        else:
            return make_response(jsonify({'error': 'Project not found'}), 404)

    def put(self, project_id):
        data = request.get_json()
        project = Project.query.get(project_id)
        if project:
            try:
                if 'project_name' in data:
                    project.project_name = data['project_name']
                if 'deadline' in data:
                    project.deadline = data['deadline']

                db.session.commit()
                return make_response(jsonify(project.to_dict()), 200)
            except Exception as e:
                error_message = f"An error occurred: {e}"
                print(error_message)
                return make_response(jsonify({'error': error_message}), 500)
        else:
            return make_response(jsonify({'error': 'Project not found'}), 404)

    def delete(self, project_id):
        project = Project.query.get(project_id)
        if project:
            tasks = Task.query.filter_by(project_id=project_id).all()
            try:
                for task in tasks:
                    db.session.delete(task)
                db.session.delete(project)
                db.session.commit()
                return make_response(jsonify({'message': 'Project deleted successfully'}), 200)
            except Exception as e:
                error_message = f"An error occurred: {e}"
                print(error_message)
                return make_response(jsonify({'error': error_message}), 500)
        else:
            return make_response(jsonify({'error': 'Project not found'}), 404)
        

class Tasks(Resource):
    def get(self):
        try:
            # Pagination parameters
            page = request.args.get('page', default=1, type=int)
            per_page = request.args.get('per_page', default=10, type=int)

            # Calculate offset
            offset = (page - 1) * per_page

            # Query for paginated tasks
            paginated_tasks = Task.query.offset(offset).limit(per_page).all()
            tasks = [task.to_dict() for task in paginated_tasks]

            # Total number of tasks for pagination
            total_tasks = Task.query.count()

            # Calculate total pages
            total_pages = math.ceil(total_tasks / per_page)

            # Response with paginated tasks and pagination metadata
            response = {
                'tasks': tasks,
                'total_tasks': total_tasks,
                'total_pages': total_pages,
                'current_page': page,
                'tasks_per_page': per_page
            }

            return make_response(jsonify(response), 200)

        except Exception as e:
            error_message = f"An error occurred: {e}"
            print(error_message)
            return make_response(jsonify({'error': error_message}), 500)

    @jwt_required()
    def post(self):
        try:
            owner_id = get_jwt_identity()
            user = User.query.get(owner_id)
            if user.role != "owner":
                return {"error": "Only owners can post tasks"}, 403

            data = request.get_json()
            project_id = data.get('project_id')  # Retrieve project_id from request data
            collaborator_email = data.get('collaborator_email')  # Retrieve collaborator email from request data

            # Find the user by their email
            collaborator = User.query.filter(func.lower(User.email) == collaborator_email.lower()).first()

            if not collaborator:
                return {"error": f"User with email {collaborator_email} not found"}, 404

            new_task = Task(
                title=data['title'],
                description=data['description'],
                due_date=data.get('due_date'),
                priority=data.get('priority'),
                progress=data.get('progress'),
                user_id=owner_id,
                project_id=project_id,  # Use the retrieved project_id
                collaborator_email=collaborator_email  # Store the collaborator's email
            )

            # Add the collaborator to the task
            new_task.collaborators.append(collaborator)

            db.session.add(new_task)
            db.session.commit()

            return make_response(jsonify(new_task.to_dict()), 201)
        except Exception as e:
            error_message = f"An error occurred: {e}"
            print(error_message)
            return make_response(jsonify({'error': error_message}), 500)


class TasksByID(Resource):
    def get(self, task_id):
       task = Task.query.get(task_id)
       if task:
           return make_response(jsonify(task.to_dict()), 200)
       else:
          return make_response(jsonify({'error': 'Task not found'}), 404)

    def put(self, task_id):
        try:
            task = Task.query.get(task_id)
            if task:
                data = request.get_json()
                # Update task attributes if present in data
                for key, value in data.items():
                    setattr(task, key, value)
                db.session.commit()
                return make_response(jsonify(task.to_dict()), 200)
            else:
                return make_response(jsonify({'error': 'Task not found'}), 404)
        except Exception as e:
            error_message = f"An error occurred: {e}"
            print(error_message)
            return make_response(jsonify({'error': error_message}), 500)

    def delete(self, task_id):
        try:
            task = Task.query.get(task_id)
            if task:
                db.session.delete(task)
                db.session.commit()
                return make_response(jsonify({'message': 'Task deleted successfully'}), 200)
            else:
                return make_response(jsonify({'error': 'Task not found'}), 404)
        except Exception as e:
            error_message = f"An error occurred: {e}"
            print(error_message)
            return make_response(jsonify({'error': error_message}), 500)

class Comments(Resource):
    def get(self):
        try:
            page = request.args.get('page', default=1, type=int)
            per_page = request.args.get('per_page', default=10, type=int)

            offset = (page - 1) * per_page

            paginated_comments = Comment.query.offset(offset).limit(per_page).all()
            comments = [comment.to_dict() for comment in paginated_comments]

            total_comments = Comment.query.count()

            total_pages = math.ceil(total_comments / per_page)

            response = {
                'comments': comments,
                'total_comments': total_comments,
                'total_pages': total_pages,
                'current_page': page,
                'comments_per_page': per_page
            }

            return make_response(jsonify(response), 200)  # MVP: Pagination for Large Datasets

        except Exception as e:
            error_message = f"An error occurred: {e}"
            print(error_message)
            return make_response(jsonify({'error': error_message}), 500)


    @jwt_required()
    def post(self):
        data = request.get_json()
        try:
            user_id = get_jwt_identity()  # Retrieve user ID from JWT token
            new_comment = Comment(
                text=data['text'],
                task_id=data.get('task_id'),
                user_id=user_id  # Use the retrieved user ID
            )

            db.session.add(new_comment)
            db.session.commit()

            return make_response(jsonify(new_comment.to_dict()), 201)
        except Exception as e:
            error_message = f"An error occurred: {e}"
            print(error_message)
            return make_response(jsonify({'error': error_message}), 500)

        
class CommentByID(Resource):
    def get(self, comment_id):
        comment = Comment.query.get(comment_id)
        if comment:
            return make_response(jsonify(comment.to_dict()), 200)
        else:
            return make_response(jsonify({'error': 'Comment not found'}), 404)

    def put(self, comment_id):
        try:
            comment = Comment.query.get(comment_id)
            if comment:
                data = request.get_json()
                for key, value in data.items():
                    setattr(comment, key, value)
                db.session.commit()
                return make_response(jsonify(comment.to_dict()), 200)
            else:
                return make_response(jsonify({'error': 'Comment not found'}), 404)
        except Exception as e:
            error_message = f"An error occurred: {e}"
            print(error_message)
            return make_response(jsonify({'error': error_message}), 500)

    def delete(self, comment_id):
        try:
            comment = Comment.query.get(comment_id)
            if comment:
                db.session.delete(comment)
                db.session.commit()
                return make_response(jsonify({'message': 'Comment deleted successfully'}), 200)
            else:
                return make_response(jsonify({'error': 'Comment not found'}), 404)
        except Exception as e:
            error_message = f"An error occurred: {e}"
            print(error_message)
            return make_response(jsonify({'error': error_message}), 500)

####
        
class GetCommentsForTask(Resource):
    @jwt_required()
    def get(self, task_id):
        try:
            # Query comments associated with the specified task_id
            comments = Comment.query.filter_by(task_id=task_id).all()

            # Convert comments to a list of dictionaries (customize as needed)
            comments_data = [comment.to_dict() for comment in comments]

            # Return the comments as JSON
            return make_response(jsonify(comments_data), 200)
        except Exception as e:
            # Handle exceptions (e.g., task not found)
            return make_response(jsonify({'error': str(e)}), 404)

api.add_resource(GetCommentsForTask, '/comments/<int:task_id>')

# &&&&&&


class ProjectsByUser(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        projects = Project.query.filter_by(owner_id=current_user_id).all()
        projects_json = [project.to_dict() for project in projects]
        return jsonify(projects_json)

api.add_resource(ProjectsByUser, '/projects/user')

class TasksByUser(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        tasks = Task.query.filter_by(user_id=current_user_id).all()
        tasks_json = [task.to_dict() for task in tasks]
        return jsonify(tasks_json)

api.add_resource(TasksByUser, '/tasks/user')

# New route for retrieving tasks associated with a user (User 2)
class CollaboratorTasks(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        tasks = Task.query.filter(Task.collaborators.any(id=current_user_id)).all()
        tasks_json = [task.to_dict() for task in tasks]
        return jsonify(tasks_json)

api.add_resource(CollaboratorTasks, '/tasks/collaborator')

# New route for handling notifications to collaborators based on email
@app.route('/notify/<string:collaborator_email>', methods=['POST'])
def notify_collaborator(collaborator_email):
    # Retrieve the JSON data from the request
    data = request.get_json()

    # Access the data sent in the request
    if data:
        # Implement your notification mechanism here
        # For example, you can send an email or a push notification to the collaborator
        # Use the collaborator_email variable to identify the recipient
        # You can also access other fields in the JSON data if needed

        # Once the notification is sent, return a response indicating success
        return jsonify({'message': f'Notification sent to {collaborator_email} successfully'}), 200
    else:
        # If no data is received in the request, return an error response
        return jsonify({'error': 'No data received in the request'}), 400
    
    
    
# FOR THUR
    

class DeleteTask(Resource):
    @jwt_required()
    def delete(self, task_id):
        try:
            task = Task.query.get(task_id)
            if task:
                db.session.delete(task)
                db.session.commit()
                return make_response(jsonify({'message': 'Task deleted successfully'}), 200)
            else:
                return make_response(jsonify({'error': 'Task not found'}), 404)
        except Exception as e:
            error_message = f"An error occurred: {e}"
            print(error_message)
            return make_response(jsonify({'error': error_message}), 500)

api.add_resource(DeleteTask, '/tasks/<int:task_id>/delete')






    
class ProjectsAndTasksByUser(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        
        # Fetch projects for the current user
        projects = Project.query.filter(Project.owner_id == current_user_id).all()
        projects_data = []

        for project in projects:
            # Fetch tasks related to each project
            tasks = Task.query.filter(Task.project_id == project.id).all()
            tasks_data = [task.to_dict() for task in tasks]
            
            # Add project data along with its tasks to the response
            project_data = project.to_dict()
            project_data['tasks'] = tasks_data
            projects_data.append(project_data)

        return jsonify(projects_data)

api.add_resource(ProjectsAndTasksByUser, '/projects-tasks/user')
    



api.add_resource(Index, '/')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check-session')
api.add_resource(Signup, '/signup')
api.add_resource(Logout, '/logout')
api.add_resource(Users, '/users')
api.add_resource(UsersByID, '/users/<int:user_id>')
api.add_resource(Projects, '/projects')
api.add_resource(ProjectsByID, '/projects/<int:project_id>')
api.add_resource(Tasks, '/tasks')
api.add_resource(TasksByID, '/tasks/<int:task_id>')
api.add_resource(Comments, '/comments')
api.add_resource(CommentByID, '/comments/<int:comment_id>')




if __name__ == '__main__':
    app.run(port=5555, debug=True)