from datetime import datetime, timedelta
import json
from src.models.user import db

class Card(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    theme_id = db.Column(db.Integer, db.ForeignKey('theme.id'), nullable=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.Enum('easy', 'medium', 'hard', name='difficulty_enum'), default='medium')
    tags = db.Column(db.Text)  # JSON array as string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    next_review = db.Column(db.DateTime, default=datetime.utcnow)
    review_count = db.Column(db.Integer, default=0)
    ease_factor = db.Column(db.Float, default=2.5)  # Para algoritmo de repetição espaçada
    
    # Relacionamentos
    reviews = db.relationship('CardReview', backref='card', lazy=True, cascade='all, delete-orphan')

    def get_tags(self):
        """Retorna as tags como lista"""
        if self.tags:
            try:
                return json.loads(self.tags)
            except:
                return []
        return []
    
    def set_tags(self, tags_list):
        """Define as tags a partir de uma lista"""
        self.tags = json.dumps(tags_list) if tags_list else None
    
    def calculate_next_review(self, is_correct, difficulty_rating):
        """Calcula a próxima data de revisão baseada no algoritmo de repetição espaçada"""
        if is_correct:
            self.review_count += 1
            if self.review_count == 1:
                interval = 1  # 1 dia
            elif self.review_count == 2:
                interval = 6  # 6 dias
            else:
                # Fórmula do SuperMemo SM-2
                if difficulty_rating >= 3:
                    self.ease_factor = self.ease_factor + (0.1 - (5 - difficulty_rating) * (0.08 + (5 - difficulty_rating) * 0.02))
                else:
                    self.ease_factor = max(1.3, self.ease_factor - 0.2)
                
                interval = self.review_count * self.ease_factor
        else:
            # Se errou, volta para o início
            self.review_count = 0
            interval = 0.01  # ~15 minutos
            self.ease_factor = max(1.3, self.ease_factor - 0.2)
        
        self.next_review = datetime.utcnow() + timedelta(days=interval)
        return self.next_review

    def __repr__(self):
        return f'<Card {self.id}: {self.question[:50]}...>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_id': self.category_id,
            'theme_id': self.theme_id,
            'question': self.question,
            'answer': self.answer,
            'difficulty': self.difficulty,
            'tags': self.get_tags(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'next_review': self.next_review.isoformat() if self.next_review else None,
            'review_count': self.review_count,
            'ease_factor': self.ease_factor
        }

