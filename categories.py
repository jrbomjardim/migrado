from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.category import Category, Theme

categories_bp = Blueprint('categories', __name__)

# Rotas para Categorias
@categories_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id é obrigatório'}), 400
        
        categories = Category.query.filter_by(user_id=user_id).all()
        return jsonify([category.to_dict() for category in categories]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/categories', methods=['POST'])
def create_category():
    try:
        data = request.get_json()
        
        if not data or not data.get('name') or not data.get('user_id'):
            return jsonify({'error': 'Nome e user_id são obrigatórios'}), 400
        
        category = Category(
            user_id=data['user_id'],
            name=data['name'],
            color=data.get('color', '#2E86AB'),
            icon=data.get('icon', '📚')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify(category.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    try:
        category = Category.query.get_or_404(category_id)
        data = request.get_json()
        
        if data.get('name'):
            category.name = data['name']
        if data.get('color'):
            category.color = data['color']
        if data.get('icon'):
            category.icon = data['icon']
        
        db.session.commit()
        return jsonify(category.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    try:
        category = Category.query.get_or_404(category_id)
        db.session.delete(category)
        db.session.commit()
        return jsonify({'message': 'Categoria deletada com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Rotas para Temas
@categories_bp.route('/themes', methods=['GET'])
def get_themes():
    try:
        category_id = request.args.get('category_id')
        if category_id:
            themes = Theme.query.filter_by(category_id=category_id).all()
        else:
            themes = Theme.query.all()
        
        return jsonify([theme.to_dict() for theme in themes]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/themes', methods=['POST'])
def create_theme():
    try:
        data = request.get_json()
        
        if not data or not data.get('name') or not data.get('category_id'):
            return jsonify({'error': 'Nome e category_id são obrigatórios'}), 400
        
        theme = Theme(
            category_id=data['category_id'],
            name=data['name'],
            description=data.get('description', '')
        )
        
        db.session.add(theme)
        db.session.commit()
        
        return jsonify(theme.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/themes/<int:theme_id>', methods=['PUT'])
def update_theme(theme_id):
    try:
        theme = Theme.query.get_or_404(theme_id)
        data = request.get_json()
        
        if data.get('name'):
            theme.name = data['name']
        if data.get('description'):
            theme.description = data['description']
        
        db.session.commit()
        return jsonify(theme.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/themes/<int:theme_id>', methods=['DELETE'])
def delete_theme(theme_id):
    try:
        theme = Theme.query.get_or_404(theme_id)
        db.session.delete(theme)
        db.session.commit()
        return jsonify({'message': 'Tema deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

