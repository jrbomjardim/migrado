from datetime import datetime
from src.models.user import db

class StudySession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    started_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    ended_at = db.Column(db.DateTime)
    total_cards = db.Column(db.Integer, default=0)
    correct_answers = db.Column(db.Integer, default=0)
    session_type = db.Column(db.Enum('study', 'review', 'test', name='session_type_enum'), default='study')
    
    # Relacionamentos
    reviews = db.relationship('CardReview', backref='session', lazy=True, cascade='all, delete-orphan')

    @property
    def duration_minutes(self):
        """Retorna a duração da sessão em minutos"""
        if self.ended_at and self.started_at:
            delta = self.ended_at - self.started_at
            return round(delta.total_seconds() / 60, 1)
        return 0

    @property
    def accuracy_percentage(self):
        """Retorna a porcentagem de acertos"""
        if self.total_cards > 0:
            return round((self.correct_answers / self.total_cards) * 100, 1)
        return 0

    def __repr__(self):
        return f'<StudySession {self.id}: {self.session_type}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'ended_at': self.ended_at.isoformat() if self.ended_at else None,
            'total_cards': self.total_cards,
            'correct_answers': self.correct_answers,
            'session_type': self.session_type,
            'duration_minutes': self.duration_minutes,
            'accuracy_percentage': self.accuracy_percentage
        }

class CardReview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    card_id = db.Column(db.Integer, db.ForeignKey('card.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('study_session.id'), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False)
    response_time = db.Column(db.Integer)  # em segundos
    difficulty_rating = db.Column(db.Integer)  # 1-5 (1=muito difícil, 5=muito fácil)
    reviewed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<CardReview {self.id}: Card {self.card_id} - {"✓" if self.is_correct else "✗"}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'card_id': self.card_id,
            'session_id': self.session_id,
            'is_correct': self.is_correct,
            'response_time': self.response_time,
            'difficulty_rating': self.difficulty_rating,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None
        }

class StudyGoal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    goal_type = db.Column(db.Enum('daily', 'weekly', 'monthly', name='goal_type_enum'), nullable=False)
    target_cards = db.Column(db.Integer)
    target_accuracy = db.Column(db.Float)  # Porcentagem (0-100)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<StudyGoal {self.id}: {self.goal_type} - {self.target_cards} cards>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'goal_type': self.goal_type,
            'target_cards': self.target_cards,
            'target_accuracy': self.target_accuracy,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

