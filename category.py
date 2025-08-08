from datetime import datetime
from src.models.user import db

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    color = db.Column(db.String(7), default='#2E86AB')  # Hex color
    icon = db.Column(db.String(50), default='📚')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    themes = db.relationship('Theme', backref='category', lazy=True, cascade='all, delete-orphan')
    cards = db.relationship('Card', backref='category', lazy=True)

    def __repr__(self):
        return f'<Category {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'color': self.color,
            'icon': self.icon,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'themes_count': len(self.themes),
            'cards_count': len(self.cards)
        }

class Theme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    cards = db.relationship('Card', backref='theme', lazy=True)

    def __repr__(self):
        return f'<Theme {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'category_id': self.category_id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'cards_count': len(self.cards)
        }

