# TODO.md - Modificações no Website miGrado

Este documento serve como um guia para as modificações e novas funcionalidades a serem implementadas no website miGrado. Ele está organizado em fases para facilitar o acompanhamento e a colaboração.

## Objetivo Geral

Implementar as novas funcionalidades e modificações no website, organizando o fluxo de trabalho para permitir a colaboração e continuidade por outras instâncias da MANUS.

## Fases do Projeto

### Fase 1: Análise e Planejamento das Modificações no Código Existente

**Descrição:** Nesta fase, será realizada uma análise detalhada da estrutura do código existente (assim que os arquivos forem postados no GitHub) para entender como as novas funcionalidades e correções podem ser integradas de forma eficiente. Será definido o escopo técnico de cada modificação.

**Tarefas:**
- [ ] Clonar o repositório GitHub (`https://github.com/jrbomjardim/migrado`).
- [ ] Identificar a estrutura do projeto (ex: HTML/CSS/JS puro, React, Flask, etc.).
- [ ] Mapear os arquivos e componentes relevantes para cada modificação solicitada.
- [ ] Criar um `TODO.md` detalhado com as tarefas específicas para cada modificação. (Este arquivo!)

### Fase 2: Implementação de Correções e Melhorias de UI/UX

**Descrição:** Foco na melhoria da interface do usuário e experiência do usuário, implementando as correções e novas características visuais.

**Tarefas:**
- [ ] **Correção de Cards Informativos:** Garantir que os cards na tela de início exibam as informações corretamente.
- [ ] **Correção de Meta Diária:** Implementar a funcionalidade da meta diária.
- [ ] **Edição/Exclusão de Itens em Categorias (Temas e Cards):** Habilitar a funcionalidade de edição e exclusão para temas e cards, garantindo que os botões sejam clicáveis e funcionais.
- [ ] **Visualização de Perguntas (Criação de Card):** Ao usar a lista de perguntas pré-cadastradas, exibir apenas as 10 primeiras questões na visualização para o usuário. As demais questões devem ser processadas normalmente para a criação do card, mas visualmente ocultas (sugestão: aplicar um efeito de blur ou similar para indicar que há mais conteúdo).
- [ ] **após visualizar a lista, só permitir adicionar se o usuário for premium (realizado o pagamento), mostrar o seguinte alerta caso ele não tenha realizado o pagamento: "recurso disponível somente na versão premium".
- [ ] **Remoção da Logo MANUS:** Localizar e remover todas as instâncias da logo MANUS no projeto.
- [ ] **Alteração do Nome do Projeto:** Mudar o nome do projeto para "miGrado" em todas as referências visuais e no código, se aplicável.
- [ ] **Alteração de Cores:** Implementar um novo esquema de cores moderno, com preferência por cores frias, aplicando-o de forma consistente em todo o projeto.
- [ ] **Implementação de Animações:** Adicionar animações sutis e intuitivas em pontos chave da interação do usuário (ex: login, acerto de questão).
- [2] **Modo Dia/Noite (Escuro/Claro):** Desenvolver a funcionalidade para o usuário alternar entre o modo dia e noite (claro e escuro).

### Fase 3: Desenvolvimento de Funcionalidades de Autenticação e Gerenciamento de Usuários (Básico)

**Descrição:** Foco nas funcionalidades essenciais de autenticação e perfil do usuário.

**Tarefas:**
- [ ] **Sistema de Perfil do Usuário:** Criar um sistema de perfil acessível no canto superior direito, permitindo:
    - [ ] Upload e exibição de foto de perfil.
    - [ ] Alteração de senha.
    - [ ] Outras configurações básicas da conta.
- [ ] **Tela de Login - Remoção de Informações:** Remover as informações "para testar, crie uma conta ou use:" e o indicativo de usuário/credenciais demo.
- [ ] **Tela de Login - Recuperar Senha/Conta:** Habilitar a função de recuperação de senha/conta via e-mail.
- [ ] **Tutorial Intuitivo:** Ao fazer login, apresentar um pequeno tutorial intuitivo e dinâmico mostrando as funções básicas do site.

### Fase 4: Integração de Sistema de Pagamento e Controle de Acesso

**Descrição:** Implementação do sistema de monetização e controle de acesso baseado em assinatura.

**Tarefas:**
- [ ] **Integração Mercado Pago:** Configurar a integração com o Mercado Pago para processamento de pagamentos (R$ 49,99).
- [ ] **Período de Teste (24h):** Implementar a lógica para permitir acesso gratuito por 24 horas após o cadastro.
- [ ] **Controle de Acesso Pós-Teste:** Após o período de teste, exigir o pagamento para acesso contínuo.
- [ ] **Exibição de Tempo Restante:** No topo do site, exibir uma pequena mensagem mostrando o tempo de acesso restante para usuários no período de teste.
- [ ] **Duração do Acesso Pago:** Configurar o acesso pago para 06 meses após a confirmação do pagamento.

### Fase 5: Implementação de Sistema de Gerenciamento de Usuários (Administrador)

**Descrição:** Desenvolvimento de um painel administrativo para gerenciar usuários e suas permissões.

**Tarefas:**
- [ ] **Controle de Perfil:** Permitir que o administrador visualize e edite perfis de usuários.
- [ ] **Nível de Acesso:** Gerenciar os níveis de acesso dos usuários (ex: básico, premium, administrador).
- [ ] **Plano Contratado:** Visualizar e alterar o plano de assinatura do usuário (período de teste, pago).
- [ ] **Gestão de Pagamentos:** Acompanhar o status de pagamento dos usuários.
- [ ] **Outras Funções de Gestão:** Implementar outras funcionalidades relacionadas à gestão de usuários, conforme necessário.

### Fase 6: Testes e Documentação Final

**Descrição:** Realização de testes abrangentes e finalização da documentação do projeto.

**Tarefas:**
- [ ] **Testes de Funcionalidade:** Testar todas as funcionalidades implementadas para garantir que operam conforme o esperado.
- [ ] **Testes de Usabilidade (UI/UX):** Verificar a experiência do usuário e a fluidez da interface.
- [ ] **Testes de Segurança:** Realizar testes de segurança, especialmente para autenticação e transações financeiras.
- [ ] **Documentação Técnica:** Atualizar e/ou criar documentação técnica do código para facilitar futuras manutenções.
- [ ] **Documentação do Usuário:** Criar ou atualizar a documentação para o usuário final, explicando as funcionalidades do site.
- [ ] **Entrega Final:** Apresentar o projeto finalizado ao usuário e entregar todos os artefatos (código, documentação, etc.).

