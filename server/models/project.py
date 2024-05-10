from config import db
from sqlalchemy_serializer import SerializerMixin

class Project(db.Model,SerializerMixin):
    __tablename__ = 'projects'
    serialize_rules = ('-owner', '-tasks',)

    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(100), nullable=False)
    deadline = db.Column(db.String)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    tasks = db.relationship('Task', backref='project', lazy=True)

    def __repr__(self):
        return f'<Project {self.project_name}>'
    
    