from config import db 
from sqlalchemy_serializer import SerializerMixin


class Comment(db.Model,SerializerMixin):
    __tablename__ = 'comments'
    serialize_rules = ('-task','-user', )

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String, nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f'<Comment {self.id}>'
    

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            # 'username': self.username,
        }
