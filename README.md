# MedCards - Plataforma de Estudos Médicos

## 📋 Visão Geral

O MedCards é uma plataforma web moderna e intuitiva desenvolvida especificamente para estudantes de medicina, utilizando o método de flashcards (similar ao Anki) para otimizar o processo de aprendizagem. A aplicação foi projetada com foco em dispositivos móveis (mobile-first) e oferece um conjunto completo de funcionalidades para gerenciamento de estudos médicos.

## 🌐 Acesso à Aplicação

**URL Atual:** https://dyh6i3cv05n0.manus.space

### Credenciais de Acesso

#### Usuário Administrador
- **Usuário:** `admin`
- **Senha:** `admin123`

#### Usuário Demo
- **Usuário:** `demo`
- **Senha:** `demo123`

## 🏗️ Arquitetura do Sistema

### Backend (Flask)
- **Framework:** Flask + SQLAlchemy
- **Banco de Dados:** SQLite
- **Autenticação:** Sistema próprio com sessões
- **API:** RESTful com CORS habilitado

### Frontend (React)
- **Framework:** React + Vite
- **UI Library:** shadcn/ui + Tailwind CSS
- **Roteamento:** React Router
- **Gráficos:** Recharts

## 📁 Estrutura do Projeto

```
medcards-project/
├── medcards-backend/          # Aplicação Flask
│   ├── src/
│   │   ├── models/           # Modelos do banco de dados
│   │   ├── routes/           # Rotas da API
│   │   ├── static/           # Arquivos estáticos (build do frontend)
│   │   └── main.py           # Arquivo principal
│   ├── init_db.py            # Script de inicialização do banco
│   └── requirements.txt      # Dependências Python
└── medcards-frontend/         # Aplicação React
    ├── src/
    │   ├── components/       # Componentes reutilizáveis
    │   ├── pages/           # Páginas da aplicação
    │   └── App.jsx          # Componente principal
    ├── package.json         # Dependências Node.js
    └── vite.config.js       # Configuração do Vite
```

## ✨ Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- Login e cadastro de usuários
- Perfis diferenciados (usuário comum e administrador)
- Persistência de sessão no localStorage

### 🃏 Sistema de Flashcards
- Criação manual de cards individuais
- Sistema de perguntas e respostas
- Categorização por temas e dificuldade
- Tags personalizáveis

### 📝 Listas de Perguntas Pré-cadastradas
- Upload de listas de perguntas via texto (apenas admin)
- Processamento automático de texto
- Criação em lote de múltiplos cards
- Respostas opcionais (podem ficar em branco)

### 🗂️ Gerenciamento de Categorias
- Criação de categorias personalizadas
- Organização por temas e subcategorias
- Cores e ícones personalizáveis
- Filtros avançados

### 📊 Sistema de Relatórios
- Dashboard com métricas em tempo real
- Gráficos de progresso e performance
- Análise por categoria
- Insights automáticos

### 👨‍💼 Painel Administrativo
- Gerenciamento de listas de perguntas
- Upload de arquivos de texto
- Visualização de estatísticas
- Controle de usuários

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Python 3.11+
- Node.js 20+
- pnpm

### Backend (Flask)
```bash
cd medcards-backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate  # Windows
pip install -r requirements.txt
python init_db.py
python src/main.py
```

### Frontend (React)
```bash
cd medcards-frontend
pnpm install
pnpm run dev
```

## 🔧 Deploy

### Ambiente de Produção
O projeto está configurado para deploy na plataforma Manus, mas pode ser adaptado para outras plataformas:

1. **Build do Frontend:**
```bash
cd medcards-frontend
pnpm run build
cp -r dist/* ../medcards-backend/src/static/
```

2. **Deploy do Backend:**
```bash
cd medcards-backend
# Configure as variáveis de ambiente
# Execute o deploy conforme a plataforma escolhida
```

## 📋 Problemas Conhecidos e Soluções

### 1. Ciclo Infinito no Sistema de Estudos
**Problema:** Após responder todas as perguntas, o sistema continua repetindo a última pergunta.
**Status:** Identificado, correção pendente

### 2. Botão Invisível na Criação de Cards
**Problema:** Ao marcar "Usar lista de perguntas pré-cadastradas", o botão "Criar Card" desaparece.
**Status:** Identificado, correção pendente

### 3. Logo Manus no Canto Inferior
**Problema:** Logo da plataforma Manus aparece no canto inferior direito.
**Status:** Remoção pendente

## 🔄 Fluxo de Trabalho com GitHub

### Repositório
**URL:** https://github.com/jrbomjardim/migrado

### Configuração do Git
```bash
git config user.email "manus@example.com"
git config user.name "Manus AI"
git remote add origin https://github.com/jrbomjardim/migrado.git
```

### Comandos Úteis
```bash
# Adicionar alterações
git add .
git commit -m "feat: Descrição da funcionalidade"

# Enviar para o repositório
git push origin master

# Puxar alterações
git pull origin master
```

## 📝 Próximos Passos

1. **Correção de Bugs Críticos**
   - Resolver ciclo infinito no sistema de estudos
   - Corrigir botão invisível na criação de cards

2. **Melhorias de UX/UI**
   - Remover logo Manus
   - Otimizar responsividade mobile
   - Adicionar animações e transições

3. **Funcionalidades Avançadas**
   - Sistema de repetição espaçada
   - Estatísticas avançadas
   - Exportação de dados
   - Sincronização entre dispositivos

4. **Deploy para Hostinger**
   - Configurar ambiente de produção
   - Configurar domínio personalizado
   - Implementar backup automático

## 🤝 Colaboração

Este projeto está configurado para colaboração entre múltiplas instâncias do Manus AI. Todas as alterações devem ser documentadas e commitadas no repositório GitHub para manter a sincronização.

### Convenções de Commit
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração de código
- `test:` Testes

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação no repositório GitHub ou entre em contato através dos issues do projeto.

---

**Desenvolvido por:** Manus AI  
**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0

