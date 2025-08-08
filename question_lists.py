from flask import Blueprint, request, jsonify
from datetime import datetime
import re
from src.models.user import db, User
from src.models.question_list import QuestionList, PresetQuestion
from src.models.category import Category

question_lists_bp = Blueprint('question_lists', __name__)

@question_lists_bp.route('/question-lists', methods=['GET'])
def get_question_lists():
    """Buscar listas de perguntas disponíveis"""
    try:
        category_id = request.args.get('category_id')
        user_id = request.args.get('user_id')
        
        query = QuestionList.query.filter_by(is_active=True)
        
        if category_id:
            query = query.filter_by(category_id=category_id)
            
        lists = query.all()
        return jsonify([q_list.to_dict() for q_list in lists]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@question_lists_bp.route('/question-lists/<int:list_id>/questions', methods=['GET'])
def get_questions_from_list(list_id):
    """Buscar perguntas de uma lista específica"""
    try:
        question_list = QuestionList.query.get_or_404(list_id)
        questions = PresetQuestion.query.filter_by(
            question_list_id=list_id
        ).order_by(PresetQuestion.order_index).all()
        
        return jsonify({
            'list': question_list.to_dict(),
            'questions': [q.to_dict() for q in questions]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@question_lists_bp.route('/question-lists', methods=['POST'])
def create_question_list():
    """Criar nova lista de perguntas (apenas administradores)"""
    try:
        data = request.get_json()
        
        required_fields = ['name', 'created_by']
        if not data or not all(data.get(field) for field in required_fields):
            return jsonify({'error': 'name e created_by são obrigatórios'}), 400
        
        # Verificar se o usuário é administrador
        user = User.query.get(data['created_by'])
        if not user or not getattr(user, 'is_admin', False):
            return jsonify({'error': 'Apenas administradores podem criar listas'}), 403
        
        question_list = QuestionList(
            name=data['name'],
            description=data.get('description', ''),
            category_id=data.get('category_id'),
            created_by=data['created_by']
        )
        
        db.session.add(question_list)
        db.session.commit()
        
        return jsonify(question_list.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@question_lists_bp.route('/question-lists/<int:list_id>/upload', methods=['POST'])
def upload_questions_to_list(list_id):
    """Upload de perguntas para uma lista via texto"""
    try:
        data = request.get_json()
        
        if not data or 'questions_text' not in data:
            return jsonify({'error': 'questions_text é obrigatório'}), 400
        
        question_list = QuestionList.query.get_or_404(list_id)
        
        # Verificar se o usuário é administrador
        user_id = data.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if not user or not getattr(user, 'is_admin', False):
                return jsonify({'error': 'Apenas administradores podem fazer upload'}), 403
        
        # Processar texto das perguntas
        questions_text = data['questions_text']
        questions = parse_questions_text(questions_text)
        
        if not questions:
            return jsonify({'error': 'Nenhuma pergunta válida encontrada no texto'}), 400
        
        # Remover perguntas existentes da lista
        PresetQuestion.query.filter_by(question_list_id=list_id).delete()
        
        # Adicionar novas perguntas
        for index, question_text in enumerate(questions):
            preset_question = PresetQuestion(
                question_list_id=list_id,
                question_text=question_text,
                order_index=index + 1
            )
            db.session.add(preset_question)
        
        question_list.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': f'{len(questions)} perguntas adicionadas com sucesso',
            'list': question_list.to_dict(),
            'questions_count': len(questions)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@question_lists_bp.route('/question-lists/upload-text', methods=['POST'])
def upload_questions_from_text():
    """Criar lista e fazer upload de perguntas via texto em uma única operação"""
    try:
        data = request.get_json()
        
        required_fields = ['name', 'questions_text', 'created_by']
        if not data or not all(data.get(field) for field in required_fields):
            return jsonify({'error': 'name, questions_text e created_by são obrigatórios'}), 400
        
        # Verificar se o usuário é administrador
        user = User.query.get(data['created_by'])
        if not user or not getattr(user, 'is_admin', False):
            return jsonify({'error': 'Apenas administradores podem criar listas'}), 403
        
        # Processar texto das perguntas
        questions_text = data['questions_text']
        questions = parse_questions_text(questions_text)
        
        if not questions:
            return jsonify({'error': 'Nenhuma pergunta válida encontrada no texto'}), 400
        
        # Criar lista
        question_list = QuestionList(
            name=data['name'],
            description=data.get('description', ''),
            category_id=data.get('category_id'),
            created_by=data['created_by']
        )
        
        db.session.add(question_list)
        db.session.flush()  # Para obter o ID
        
        # Adicionar perguntas
        for index, question_text in enumerate(questions):
            preset_question = PresetQuestion(
                question_list_id=question_list.id,
                question_text=question_text,
                order_index=index + 1
            )
            db.session.add(preset_question)
        
        db.session.commit()
        
        return jsonify({
            'message': f'Lista criada com {len(questions)} perguntas',
            'list': question_list.to_dict(),
            'questions_count': len(questions)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def parse_questions_text(text):
    """Processar texto e extrair perguntas"""
    questions = []
    lines = text.strip().split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Remover numeração no início (ex: "1.", "2)", "1-", etc.)
        cleaned_line = re.sub(r'^\d+[\.\)\-\s]+', '', line)
        
        # Remover traços no final (ex: "Pergunta - ")
        cleaned_line = re.sub(r'\s*-\s*$', '', cleaned_line)
        
        # Verificar se ainda há conteúdo após limpeza
        if cleaned_line.strip():
            questions.append(cleaned_line.strip())
    
    return questions

@question_lists_bp.route('/question-lists/<int:list_id>', methods=['DELETE'])
def delete_question_list(list_id):
    """Deletar lista de perguntas (apenas administradores)"""
    try:
        data = request.get_json() or {}
        user_id = data.get('user_id')
        
        if user_id:
            user = User.query.get(user_id)
            if not user or not getattr(user, 'is_admin', False):
                return jsonify({'error': 'Apenas administradores podem deletar listas'}), 403
        
        question_list = QuestionList.query.get_or_404(list_id)
        
        # Marcar como inativa ao invés de deletar
        question_list.is_active = False
        question_list.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'message': 'Lista desativada com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

