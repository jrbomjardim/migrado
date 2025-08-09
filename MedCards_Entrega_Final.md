# MedCards - Plataforma de Estudos Médicos

## 🎯 Visão Geral

O **MedCards** é uma plataforma moderna e intuitiva para estudos médicos baseada no método de flashcards (similar ao Anki). Foi desenvolvida especificamente para estudantes de medicina, com foco na experiência mobile e funcionalidades avançadas de acompanhamento de desempenho.

## 🌐 Acesso à Aplicação

**URL de Produção:** https://58hpi8cww7v0.manus.space

### Credenciais de Demonstração
- **Usuário:** demo
- **Senha:** demo123

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Login e cadastro de usuários
- Perfis personalizados para estudantes
- Sessões seguras e persistentes

### 📚 Gerenciamento de Cards
- Criação de flashcards personalizados
- Sistema de pergunta e resposta
- Interface intuitiva com animações suaves
- Feedback visual para acertos e erros

### 🗂️ Organização por Categorias
- Criação de categorias personalizadas (ex: Anatomia, Fisiologia, Patologia)
- Subcategorias e temas específicos
- Filtros avançados para organização
- Cores e ícones personalizáveis

### 📊 Relatórios e Analytics
- **Dashboard de Desempenho:** Métricas em tempo real
- **Gráficos Interativos:** 
  - Progresso diário com gráfico de área
  - Volume de estudos com gráfico de barras
  - Performance por categoria com gráfico de pizza
  - Análise detalhada por área de estudo
- **Métricas Principais:**
  - Total de cards revisados
  - Precisão geral (%)
  - Número de acertos
  - Tempo médio por card
- **Insights Automáticos:**
  - Identificação de pontos fortes
  - Áreas que precisam de melhoria
  - Dicas personalizadas de estudo

### 📱 Design Mobile-First
- Interface responsiva otimizada para smartphones
- Navegação intuitiva com gestos touch
- Componentes adaptados para telas pequenas
- Performance otimizada para dispositivos móveis

### 🎨 Interface Moderna
- Design clean e profissional
- Paleta de cores médica (azuis e verdes)
- Tipografia legível e acessível
- Animações suaves e feedback visual
- Componentes shadcn/ui para consistência

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de interface
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações

### Backend
- **Flask** - Framework web Python
- **SQLite** - Banco de dados
- **Flask-CORS** - Suporte a CORS
- **Werkzeug** - Utilitários web

### Infraestrutura
- **Deploy automático** na plataforma Manus
- **HTTPS** habilitado
- **Domínio permanente** fornecido

## 📋 Estrutura do Projeto

### Páginas Principais

1. **Login/Cadastro** - Autenticação de usuários
2. **Dashboard** - Visão geral e acesso rápido
3. **Estudar** - Interface de flashcards
4. **Categorias** - Gerenciamento de categorias e temas
5. **Relatórios** - Analytics e métricas de desempenho

### Componentes Reutilizáveis

- **Layout** - Estrutura base com navegação
- **Cards** - Componentes de flashcard
- **Gráficos** - Visualizações de dados
- **Formulários** - Inputs e validações
- **Modais** - Diálogos e confirmações

## 🎯 Funcionalidades Específicas para Medicina

### Categorias Pré-definidas
- Anatomia Humana
- Fisiologia
- Patologia
- Farmacologia
- Clínica Médica
- Cirurgia
- Pediatria
- Ginecologia e Obstetrícia

### Tipos de Cards Especializados
- Diagnóstico diferencial
- Casos clínicos
- Imagens médicas
- Protocolos e guidelines
- Dosagens e medicamentos

### Sistema de Revisão Espaçada
- Algoritmo baseado na curva de esquecimento
- Intervalos adaptativos baseados no desempenho
- Priorização de cards com maior dificuldade

## 📈 Métricas e Relatórios

### Dashboard Principal
- Cards estudados hoje
- Precisão da semana
- Streak de estudos
- Próximas revisões

### Relatórios Detalhados
- **Performance por Categoria:** Identifica áreas fortes e fracas
- **Progresso Temporal:** Evolução ao longo do tempo
- **Análise de Erros:** Padrões de dificuldade
- **Tempo de Estudo:** Distribuição e eficiência

### Insights Automáticos
- Recomendações personalizadas
- Identificação de padrões de estudo
- Sugestões de cronograma
- Alertas de revisão

## 🔧 Configuração e Personalização

### Perfil do Usuário
- Informações pessoais
- Preferências de estudo
- Metas e objetivos
- Configurações de notificação

### Customização da Interface
- Temas de cores
- Tamanho da fonte
- Velocidade das animações
- Layout dos cards

## 🚀 Próximos Passos e Melhorias

### Funcionalidades Futuras
1. **Sistema de Gamificação**
   - Pontos e badges
   - Rankings entre usuários
   - Desafios diários

2. **Colaboração**
   - Compartilhamento de decks
   - Estudo em grupo
   - Comentários e discussões

3. **Inteligência Artificial**
   - Geração automática de cards
   - Análise de imagens médicas
   - Assistente virtual de estudos

4. **Integração com Recursos Externos**
   - Importação de PDFs
   - Sincronização com calendário
   - Integração com plataformas de ensino

### Otimizações Técnicas
- Cache avançado para performance
- Sincronização offline
- Backup automático na nuvem
- API para integrações

## 📱 Guia de Uso Mobile

### Navegação Principal
- **Swipe lateral:** Acesso ao menu
- **Tap duplo:** Virar card rapidamente
- **Swipe vertical:** Navegar entre cards
- **Pinch to zoom:** Ampliar imagens

### Gestos Específicos
- **Swipe direita:** Marcar como "Fácil"
- **Swipe esquerda:** Marcar como "Difícil"
- **Tap longo:** Opções avançadas
- **Shake:** Embaralhar deck

## 🎨 Design System

### Paleta de Cores
- **Primária:** #2E86AB (Azul médico)
- **Secundária:** #06D6A0 (Verde saúde)
- **Acento:** #F18F01 (Laranja energia)
- **Alerta:** #C73E1D (Vermelho atenção)
- **Neutros:** Escala de cinzas

### Tipografia
- **Títulos:** Inter Bold
- **Corpo:** Inter Regular
- **Código:** JetBrains Mono

### Componentes
- Botões com estados hover/active
- Cards com sombras suaves
- Inputs com validação visual
- Gráficos com cores consistentes

## 🔒 Segurança e Privacidade

### Proteção de Dados
- Senhas criptografadas
- Sessões seguras
- Dados locais protegidos
- Conformidade com LGPD

### Backup e Recuperação
- Backup automático dos dados
- Exportação de decks
- Recuperação de conta
- Histórico de versões

## 📞 Suporte e Documentação

### Recursos de Ajuda
- Tutorial interativo
- FAQ integrado
- Vídeos explicativos
- Chat de suporte

### Comunidade
- Fórum de usuários
- Grupos de estudo
- Compartilhamento de dicas
- Feedback e sugestões

---

## 🎉 Conclusão

O **MedCards** representa uma solução completa e moderna para estudos médicos, combinando a eficácia comprovada dos flashcards com tecnologia de ponta e design centrado no usuário. A plataforma está pronta para uso e pode ser acessada imediatamente através do link fornecido.

**Desenvolvido com ❤️ para estudantes de medicina**

---

*Para mais informações ou suporte técnico, entre em contato através da plataforma.*

