# MedCards - Arquitetura Técnica

## Stack Tecnológico

### Frontend
- **React.js 18** com Hooks
- **CSS Modules** ou **Styled Components**
- **React Router** para navegação
- **Axios** para requisições HTTP
- **Chart.js** para gráficos e relatórios

### Backend
- **Flask** (Python)
- **SQLAlchemy** ORM
- **Flask-JWT-Extended** para autenticação
- **Flask-CORS** para CORS
- **SQLite** (desenvolvimento) / **PostgreSQL** (produção)

## Estrutura do Banco de Dados

### Tabela: users
```sql
id (INTEGER, PRIMARY KEY)
username (VARCHAR(50), UNIQUE, NOT NULL)
email (VARCHAR(100), UNIQUE, NOT NULL)
password_hash (VARCHAR(255), NOT NULL)
created_at (DATETIME, DEFAULT NOW)
last_login (DATETIME)
```

### Tabela: categories
```sql
id (INTEGER, PRIMARY KEY)
user_id (INTEGER, FOREIGN KEY)
name (VARCHAR(100), NOT NULL)
color (VARCHAR(7), DEFAULT '#2E86AB')
icon (VARCHAR(50))
created_at (DATETIME, DEFAULT NOW)
```

### Tabela: themes
```sql
id (INTEGER, PRIMARY KEY)
category_id (INTEGER, FOREIGN KEY)
name (VARCHAR(100), NOT NULL)
description (TEXT)
created_at (DATETIME, DEFAULT NOW)
```

### Tabela: cards
```sql
id (INTEGER, PRIMARY KEY)
user_id (INTEGER, FOREIGN KEY)
category_id (INTEGER, FOREIGN KEY)
theme_id (INTEGER, FOREIGN KEY)
question (TEXT, NOT NULL)
answer (TEXT, NOT NULL)
difficulty (ENUM: 'easy', 'medium', 'hard')
tags (TEXT) -- JSON array
created_at (DATETIME, DEFAULT NOW)
updated_at (DATETIME)
```

### Tabela: study_sessions
```sql
id (INTEGER, PRIMARY KEY)
user_id (INTEGER, FOREIGN KEY)
started_at (DATETIME, NOT NULL)
ended_at (DATETIME)
total_cards (INTEGER)
correct_answers (INTEGER)
session_type (ENUM: 'study', 'review', 'test')
```

### Tabela: card_reviews
```sql
id (INTEGER, PRIMARY KEY)
user_id (INTEGER, FOREIGN KEY)
card_id (INTEGER, FOREIGN KEY)
session_id (INTEGER, FOREIGN KEY)
is_correct (BOOLEAN, NOT NULL)
response_time (INTEGER) -- em segundos
difficulty_rating (INTEGER) -- 1-5
reviewed_at (DATETIME, DEFAULT NOW)
next_review (DATETIME) -- para repetição espaçada
```

### Tabela: study_goals
```sql
id (INTEGER, PRIMARY KEY)
user_id (INTEGER, FOREIGN KEY)
goal_type (ENUM: 'daily', 'weekly', 'monthly')
target_cards (INTEGER)
target_accuracy (DECIMAL)
start_date (DATE)
end_date (DATE)
is_active (BOOLEAN, DEFAULT TRUE)
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Perfil do usuário

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/{id}` - Atualizar categoria
- `DELETE /api/categories/{id}` - Deletar categoria

### Temas
- `GET /api/themes` - Listar temas
- `GET /api/themes/category/{category_id}` - Temas por categoria
- `POST /api/themes` - Criar tema
- `PUT /api/themes/{id}` - Atualizar tema
- `DELETE /api/themes/{id}` - Deletar tema

### Cards
- `GET /api/cards` - Listar cards (com filtros)
- `GET /api/cards/{id}` - Detalhes do card
- `POST /api/cards` - Criar card
- `PUT /api/cards/{id}` - Atualizar card
- `DELETE /api/cards/{id}` - Deletar card
- `GET /api/cards/study` - Cards para estudo (algoritmo de repetição)

### Sessões de Estudo
- `POST /api/study/start` - Iniciar sessão
- `POST /api/study/answer` - Registrar resposta
- `POST /api/study/end` - Finalizar sessão
- `GET /api/study/history` - Histórico de sessões

### Relatórios
- `GET /api/reports/performance` - Relatório de desempenho
- `GET /api/reports/progress` - Progresso ao longo do tempo
- `GET /api/reports/categories` - Performance por categoria
- `GET /api/reports/weak-points` - Pontos fracos identificados

### Metas e Cronograma
- `GET /api/goals` - Listar metas
- `POST /api/goals` - Criar meta
- `PUT /api/goals/{id}` - Atualizar meta
- `GET /api/schedule` - Cronograma de estudos

## Componentes React

### Estrutura de Pastas
```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── Navigation/
│   ├── study/
│   │   ├── FlashCard/
│   │   ├── StudySession/
│   │   └── ProgressBar/
│   ├── categories/
│   │   ├── CategoryList/
│   │   ├── CategoryForm/
│   │   └── ThemeManager/
│   └── reports/
│       ├── PerformanceChart/
│       ├── ProgressChart/
│       └── StatsSummary/
├── pages/
│   ├── Home/
│   ├── Study/
│   ├── Categories/
│   ├── Reports/
│   ├── Schedule/
│   └── Settings/
├── hooks/
│   ├── useAuth.js
│   ├── useStudySession.js
│   └── useLocalStorage.js
├── services/
│   ├── api.js
│   ├── auth.js
│   └── storage.js
└── utils/
    ├── constants.js
    ├── helpers.js
    └── algorithms.js
```

## Algoritmo de Repetição Espaçada

### Lógica Simplificada
```python
def calculate_next_review(card_id, is_correct, difficulty_rating):
    if is_correct:
        if difficulty_rating >= 4:  # Fácil
            next_review = now + 3 days
        elif difficulty_rating >= 3:  # Médio
            next_review = now + 1 day
        else:  # Difícil
            next_review = now + 12 hours
    else:
        next_review = now + 10 minutes  # Revisar em breve
    
    return next_review
```

## Funcionalidades PWA
- Service Worker para cache offline
- Manifest.json para instalação
- Notificações push para lembretes
- Sincronização em background

## Segurança
- Validação de entrada em todas as APIs
- Rate limiting
- HTTPS obrigatório
- Sanitização de dados
- Proteção contra XSS e CSRF

