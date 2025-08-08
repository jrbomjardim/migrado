from datetime import datetime
from src.models.user import db

class QuestionList(db.Model):
    __tablename__ = 'question_lists'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer)
    created_by = db.Column(db.Integer, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos removidos para evitar problemas de foreign key
    
    def to_dict(self):
        # Contar perguntas manualmente
        questions_count = PresetQuestion.query.filter_by(question_list_id=self.id).count()
        
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category_id': self.category_id,
            'created_by': self.created_by,
            'is_active': self.is_active,
            'questions_count': questions_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class PresetQuestion(db.Model):
    __tablename__ = 'preset_questions'
    
    id = db.Column(db.Integer, primary_key=True)
    question_list_id = db.Column(db.Integer, nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    order_index = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'question_list_id': self.question_list_id,
            'question_text': self.question_text,
            'order_index': self.order_index,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

