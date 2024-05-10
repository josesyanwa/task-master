from config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from models.user import User


# New association table for the many-to-many relationship between tasks and collaborators
task_collaborators = db.Table('task_collaborators',
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'
    serialize_rules = ('-project', '-user', '-collaborators')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.String, nullable=False)  # Changed to DateTime
    priority = db.Column(db.String(20), default='medium')  # Priority can be 'low', 'medium', 'high'
    progress = db.Column(db.Integer, default=0)
    collaborator_email = db.Column(db.String(100), nullable=True)  # Column for inputting collaborator email
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    
    # Establishing the many-to-many relationship with users who are collaborators
    collaborators = db.relationship('User', secondary=task_collaborators, backref='tasks_collaborated')

    @validates('priority')
    def validate_priority(self, key, value):
        if value not in ['low', 'medium', 'high']:
            raise ValueError("Priority must be 'low', 'medium', or 'high'")
        return value

    def __repr__(self):
        return f'<Task {self.title}>'

    def add_collaborator_by_email(self, email):
        """
        Method to add a collaborator to the task using email and send a notification.
        """
        # You need to fetch the user with the given email from the database
        collaborator = User.query.filter_by(email=email).first()
        if collaborator:
            if collaborator not in self.collaborators:
                self.collaborators.append(collaborator)
                # You can implement the notification system here
                # For example, you can send an email or a push notification
                # to the collaborator informing them about their addition to the task.
        else:
            # Handle case when no user with the given email is found
            pass  # You can raise an error or handle it as per your requirement


    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description':self.description,
            'due_date': self.due_date,
            'priority': self.priority,
            'progress': self.progress,
            'collaborator_email': self.collaborator_email,
            # Include other attributes as needed
        }