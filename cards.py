@cards_bp.route('/cards', methods=['POST'])
def create_card():
    try:
        data = request.get_json()
        
        required_fields = ['user_id', 'category_id', 'question', 'answer']
        if not data or not all(data.get(field) for field in required_fields):
            return jsonify({'error': 'user_id, category_id, question e answer são obrigatórios'}), 400
        
        card = Card(
            user_id=data['user_id'],
            category_id=data['category_id'],
            theme_id=data.get('theme_id'),
            question=data['question'],
            answer=data['answer'],
            difficulty=data.get('difficulty', 'medium')
        )
        
        # Definir tags se fornecidas
        if data.get('tags'):
            card.set_tags(data['tags'])
        
        db.session.add(card)
        db.session.commit()
        
        return jsonify(card.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cards_bp.route('/cards/<int:card_id>', methods=['PUT'])
def update_card(card_id):
    try:
        card = Card.query.get_or_404(card_id)
        data = request.get_json()
        
        # Atualizar campos se fornecidos
        if data.get('question'):
            card.question = data['question']
        if data.get('answer'):
            card.answer = data['answer']
        if data.get('difficulty'):
            card.difficulty = data['difficulty']
        if data.get('category_id'):
            card.category_id = data['category_id']
        if data.get('theme_id'):
            card.theme_id = data['theme_id']
        if 'tags' in data:
            card.set_tags(data['tags'])
        
        card.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(card.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cards_bp.route('/cards/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):