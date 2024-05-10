from faker import Faker
from config import db,app,bcrypt
from models.comment import Comment
from models.project import Project
from models.task import Task
from models.user import User
import random

fake = Faker()

def create_users(num_users=10):
    User.query.delete()
    users = []
    for _ in range(num_users):
        username = fake.user_name()
        password = fake.password()
        email = fake.email()
        role = random.choice(['user', 'owner'])
        # Hash the password before creating the User instance
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(username=username, _password_hash=password_hash, email=email, role=role)
        users.append(user)
    db.session.add_all(users)
    db.session.commit()

def create_projects(num_projects=5, users=None):
    Project.query.delete()
    projects = []
    for _ in range(num_projects):
        project_name = fake.company()
        deadline = fake.date_time_between(start_date='-30d', end_date='+30d').strftime('%Y-%m-%d %H:%M:%S')
        owner = random.choice(users)
        project = Project(project_name=project_name, deadline=deadline, owner=owner)
        projects.append(project)
    db.session.add_all(projects)
    db.session.commit()

def create_tasks(num_tasks=20, users=None, projects=None):
    Task.query.delete()
    tasks = []
    for _ in range(num_tasks):
        title = fake.catch_phrase()
        description = fake.text()
        due_date = fake.date_time_between(start_date='-20d', end_date='+20d').strftime('%Y-%m-%d %H:%M:%S')
        priority = random.choice(['low', 'medium', 'high'])
        progress = random.randint(0, 100)
        assigned_user = random.choice(users)
        project = random.choice(projects)
        task = Task(title=title, description=description, due_date=due_date, priority=priority, progress=progress, assigned_user=assigned_user, project=project)
        tasks.append(task)
    db.session.add_all(tasks)
    db.session.commit()

def create_comments(num_comments=50, users=None, tasks=None):
    Comment.query.delete()
    comments = []
    for _ in range(num_comments):
        text = fake.paragraph()
        user_id = random.choice(users).id
        task_id = random.choice(tasks).id
        comment = Comment(text=text, user_id=user_id, task_id=task_id)
        comments.append(comment)
    db.session.add_all(comments)
    db.session.commit()

def seed_database():
    create_users()
    users = User.query.all()
    create_projects(users=users)
    projects = Project.query.all()
    create_tasks(users=users, projects=projects)
    tasks = Task.query.all()
    create_comments(users=users, tasks=tasks)

if __name__ == "__main__":
    with app.app_context():
        seed_database()
