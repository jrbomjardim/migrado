#!/usr/bin/env python3
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.main import app, db
from src.models.user import User
from src.models.category import Category, Theme
from src.models.card import Card
from src.models.study import StudySession, CardReview, StudyGoal
from src.models.question_list import QuestionList, PresetQuestion
from werkzeug.security import generate_password_hash

def init_database():
    with app.app_context():
        # Criar todas as tabelas
        db.create_all()
        
        # Verificar se já existe usuário demo
        demo_user = User.query.filter_by(username='demo').first()
        if not demo_user:
            # Criar usuário demo
            demo_user = User(
                username='demo',
                email='demo@medcards.com',
                password_hash=generate_password_hash('demo123')
            )
            db.session.add(demo_user)
            db.session.commit()
            print("Usuário demo criado com sucesso!")
        
        # Verificar se já existe usuário admin
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            # Criar usuário admin
            admin_user = User(
                username='admin',
                email='admin@medcards.com',
                password_hash=generate_password_hash('admin123'),
                is_admin=True
            )
            db.session.add(admin_user)
            db.session.commit()
            print("Usuário admin criado com sucesso!")
        else:
            admin_user = User.query.filter_by(username='admin').first()
            
            # Criar categorias de exemplo
            categories_data = [
                {'name': 'Anatomia', 'color': '#2E86AB', 'icon': '🫀'},
                {'name': 'Fisiologia', 'color': '#06D6A0', 'icon': '⚡'},
                {'name': 'Patologia', 'color': '#F18F01', 'icon': '🔬'},
                {'name': 'Farmacologia', 'color': '#C73E1D', 'icon': '💊'},
                {'name': 'Clínica Médica', 'color': '#8E44AD', 'icon': '🩺'},
            ]
            
            for cat_data in categories_data:
                category = Category(
                    name=cat_data['name'],
                    color=cat_data['color'],
                    icon=cat_data['icon'],
                    user_id=demo_user.id
                )
                db.session.add(category)
            
            db.session.commit()
            print("Categorias de exemplo criadas!")
            
            # Criar alguns cards de exemplo
            anatomy_cat = Category.query.filter_by(name='Anatomia', user_id=demo_user.id).first()
            if anatomy_cat:
                cards_data = [
                    {
                        'question': 'Qual é o maior osso do corpo humano?',
                        'answer': 'O fêmur é o maior osso do corpo humano, localizado na coxa.',
                        'difficulty': 'easy'
                    },
                    {
                        'question': 'Quantas câmaras tem o coração humano?',
                        'answer': 'O coração humano tem 4 câmaras: 2 átrios (direito e esquerdo) e 2 ventrículos (direito e esquerdo).',
                        'difficulty': 'medium'
                    },
                    {
                        'question': 'Qual é a função principal dos alvéolos pulmonares?',
                        'answer': 'Os alvéolos pulmonares são responsáveis pela troca gasosa entre o ar e o sangue, permitindo a entrada de oxigênio e a saída de dióxido de carbono.',
                        'difficulty': 'medium'
                    }
                ]
                
                for card_data in cards_data:
                    card = Card(
                        question=card_data['question'],
                        answer=card_data['answer'],
                        difficulty=card_data['difficulty'],
                        category_id=anatomy_cat.id,
                        user_id=demo_user.id
                    )
                    db.session.add(card)
                
                db.session.commit()
                print("Cards de exemplo criados!")
        
        # Criar lista de perguntas de exemplo se não existir
        if admin_user:
            existing_list = QuestionList.query.filter_by(name='Traumatologia e Emergências').first()
            if not existing_list:
                # Criar lista de perguntas de traumatologia
                question_list = QuestionList(
                    name='Traumatologia e Emergências',
                    description='Lista de perguntas sobre traumatologia, emergências médicas e procedimentos de urgência',
                    created_by=admin_user.id
                )
                db.session.add(question_list)
                db.session.flush()  # Para obter o ID
                
                # Perguntas de exemplo baseadas no arquivo fornecido
                sample_questions = [
                    "Que es fractura",
                    "Tipos de fractura",
                    "¿En relación a la traumatología, cual tipo de trauma no es fractura?",
                    "Escala de Gustillo y Anderson (traumado)",
                    "En que consiste la revisión secundaria",
                    "¿Cuáles son los auxiliares de la revisión secundaria",
                    "Los T prevenibles en el trauma",
                    "Los 3 H del paciente politraumatizado",
                    "Composición de Ringer, Ringer lactado y solución fisiológica",
                    "Trauma tórax tipos y cual conoce",
                    "Clasificación de los traumas de tórax",
                    "De los traumas de tórax cuál es más peligroso",
                    "A partir de cuantos ml de colección se puede observar un derrame pleural en la radiografía",
                    "Neumotórax simples",
                    "Neumotórax a tensión",
                    "Clasificación radiológica del neumotórax",
                    "Neumotórax abierto – clínica y tratamiento",
                    "Hemotórax clasificación clínica y tratamiento",
                    "Cuadrantes abdominales y órganos en cada uno",
                    "Semiología abdominal - como se realiza la palpación"
                ]
                
                for index, question_text in enumerate(sample_questions):
                    preset_question = PresetQuestion(
                        question_list_id=question_list.id,
                        question_text=question_text,
                        order_index=index + 1
                    )
                    db.session.add(preset_question)
                
                db.session.commit()
                print("Lista de perguntas de exemplo criada!")
        else:
            print("Usuário demo já existe!")
        
        print("Banco de dados inicializado com sucesso!")

if __name__ == '__main__':
    init_database()

