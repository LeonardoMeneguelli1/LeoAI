# LeoAI - SaaS de IA Conversacional

Uma plataforma inteligente inspirada no ChatGPT, desenvolvida com Next.js e Express.js.

## 🚀 Funcionalidades

- **Autenticação básica**: Registro e login com JWT e bcrypt
- **Integração com IA**: Conectado ao Google Gemini 2.5 Flash
- **Múltiplos chats**: Crie e gerencie vários chats independentes
- **Memória por chat**: Cada conversa tem seu próprio histórico isolado
- **Interface moderna**: Design responsivo com Tailwind CSS (estilo ChatGPT)
- **Respostas formatadas**: Suporte a Markdown com tabelas, listas e código
- **Rate limiting**: Proteção contra abuso de API
- **Validação robusta**: Inputs validados com Joi
- **Autenticação automática**: Interceptador axios para gerenciar tokens JWT

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14+** - Framework React
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP com interceptadores
- **React Icons** - Ícones
- **Markdown-It** - Renderização de Markdown em HTML

### Backend
- **Express.js** - Servidor web
- **JWT** - Autenticação (validade: 7 dias)
- **bcrypt** - Hash de senhas
- **Joi** - Validação de dados
- **express-rate-limit** - Controle de taxa
- **Markdown-It** - Processamento de Markdown
- **Google Gemini API** - IA generativa

### Banco de Dados
- **MockDB** (em memória) - Para demonstração/prototipagem

## 📦 Instalação e Configuração

### 1. Clonar o repositório
```bash
git clone <seu-repo>
cd App_Saas_IA
```

### 2. Backend
```bash
cd backend
npm install
```

### 3. Frontend
```bash
cd ../frontend
npm install
```

### 4. Configurar variáveis de ambiente

Copie o arquivo `.env.example` e configure:

**backend/.env:**
```env
JWT_SECRET=sua_chave_secreta_super_segura_aqui
GEMINI_API_KEY=sua_chave_da_api_gemini_aqui
PORT=4001
FRONTEND_URL=http://localhost:3000
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4001
```

### 5. Executar
```bash
npm run dev
```

Acesse: http://localhost:3000

## 📖 Como Usar

1. **Criar conta**: Clique em "Registre-se" e preencha email e senha
2. **Fazer login**: Use suas credenciais para acessar
3. **Novo chat**: Clique em **"+ Novo Chat"** na sidebar para começar uma conversa
4. **Conversar**: Vá para `/chat` e comece a conversar com LeoAI
   - Digite sua pergunta no campo inferior
   - Pressione **Enter** para enviar
   - Use **Shift+Enter** para quebra de linha
5. **Gerenciar chats**:
   - Clique em um chat na sidebar para **trocar de conversa**
   - Passe o mouse sobre um chat e clique em **"⋯ → Excluir"** para **deletar**
   - Cada chat tem seu próprio histórico independente
6. **Sair**: Clique no botão "Sair" na sidebar para desconectar

### Recursos do Chat
- ➕ **Criar múltiplos chats**: Comece novas conversas quando quiser
- 📚 **Memória independente**: Cada chat mantém seu próprio histórico
- 💬 **Markdown renderizado**: Respostas com código, tabelas e formatação
- ⏳ **Indicador de digitação**: Animação enquanto a IA responde
- 🗑️ **Deletar individualmente**: Remova chats que não precisa mais
- 📱 **Responsivo**: Interface adapta a qualquer tela

## 🔒 Segurança Implementada

- ✅ **Hash de senhas** com bcrypt
- ✅ **API key protegida** no backend
- ✅ **Token JWT** com 7 dias de validade
- ✅ **Autenticação automática** via interceptador axios
- ✅ **Rate limiting** (100 req/15min global, 10/dia por usuário)
- ✅ **CORS restrito** apenas para frontend
- ✅ **Validação de inputs** com Joi
- ✅ **Sanitização de respostas** IA
- **Tratamento de erros** adequado e redirecionamento em 401
- **Logs detalhados** para debugging

## 📁 Estrutura do Projeto

```
LeoAI/
├── backend/
│   ├── controllers/
│   │   ├── aiController.js (CRUD chats + geração IA)
│   │   └── authController.js (autenticação JWT)
│   ├── middlewares/
│   │   └── authMiddleware.js (validação de tokens)
│   ├── routes/
│   │   ├── ai.js (POST/GET/DELETE /chats e /generate)
│   │   ├── auth.js (login/signup)
│   │   └── history.js (histórico legado)
│   ├── mockDB.js (estrutura: users, chats[], history[], usage)
│   ├── server.js (Express setup)
│   └── package.json
├── frontend/
│   ├── pages/
│   │   ├── _app.js
│   │   ├── index.jsx (landing page)
│   │   ├── login.jsx
│   │   ├── signup.jsx
│   │   └── chat.jsx (múltiplos chats com sidebar)
│   ├── services/
│   │   └── api.js (axios com interceptadores)
│   ├── styles/
│   │   └── globals.css (Tailwind + custom HTML styles)
│   └── package.json
├── models/
├── .env.example
└── README.md
```

## 🎯 Melhorias Implementadas

### Segurança
- ✅ **Hash de senhas** com bcrypt
- ✅ **API key protegida** no backend
- ✅ **Token JWT com 7 dias** de validade
- ✅ **Autenticação automática** via interceptador axios
- ✅ **Rate limiting** (100 req/15min global, 10/dia por usuário)
- ✅ **CORS restrito** apenas para frontend
- ✅ **Validação de inputs** com Joi
- ✅ **Sanitização de respostas** IA
- ✅ **Redirecionamento automático** em erros 401

### Rendering & UX
- ✅ **Markdown para HTML**: Respostas renderizadas com formatação completa
- ✅ **Suporte a tabelas**: GitHub Flavored Markdown (GFM)
- ✅ **Blocos de código**: Sintaxe destacada com formatação
- ✅ **Interface estilo ChatGPT**: Design moderno com sidebar
- ✅ **Histórico de conversas**: Acesso rápido em sidebar
- ✅ **Loading states**: Indicadores visuais durante processamento
- ✅ **Logout button**: Desconexão rápida

### Arquitetura & Multi-Chat
- ✅ **Centralização APIs**: Cliente axios com interceptadores
- ✅ **Gerenciamento de tokens**: Injeção automática em requisições
- ✅ **Separação clara**: routes/controllers/middlewares
- ✅ **Tratamento de erros**: Logging detalhado e redirecionamentos
- ✅ **Sistema de chats**: Múltiplos chats com IDs únicos
- ✅ **BD em memória**: Estrutura `chats[]` com `messages[]` por chat
- ✅ **Operações CRUD**: POST/GET/DELETE para gerenciar chats
- ✅ **Memória isolada**: Cada chat mantém suas mensagens separadamente

## 🚦 Status do Projeto

**Para demonstração/prototipagem**: Pronto
**Para produção**: Requer migração para BD real (PostgreSQL/Sequelize)

## 🔧 Troubleshooting

### Token Inválido
- **Solução**: Faça login novamente para gerar um novo token
- O token tem validade de 7 dias
- Se expirar, será redirecionado automaticamente para login

### IA não responde
- Verifique se `GEMINI_API_KEY` está configurada corretamente no `.env`
- Verifique os logs do backend (`npm run dev`)
- Consulte a chave da API em https://console.cloud.google.com

## 📝 Próximos Passos

1. **Banco de dados real**: Migrar do mockDB para PostgreSQL
2. **Refresh tokens**: Implementar tokens de atualização
3. **Tests**: Adicionar testes unitários e de integração
4. **Deploy**: Configurar CI/CD e hospedagem
5. **Monitoramento**: Adicionar logging e métricas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.</content>
<parameter name="filePath">c:\Users\leona\Desktop\Projects\App_Saas_IA\README.md