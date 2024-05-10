from config import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-tasks', '-projects_owned', '-task_collaborators','-project',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), default='user')  

    tasks = db.relationship('Task', backref='assigned_user', lazy=True)
    projects_owned = db.relationship('Project', backref='owner', lazy=True)

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash.encode('utf-8'), password.encode('utf-8'))

    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError("Invalid email format")
        return email
    
    @validates('role')
    def validate_role(self, key, role):
        if role not in ['user', 'owner']:
            raise ValueError("Role must be either 'user' or 'owner'")
        return role

    def to_dict(self):
        user_dict = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            # Add other attributes as needed
        }
        return user_dict