# Instruções do Copilot para este Repositório

Estas instruções ajudam o GitHub Copilot (e qualquer agente dentro do VS Code) a entender o estilo e as expectativas ao trabalhar neste projeto.

## 🧠 Contexto Geral
- O projeto é uma aplicação SaaS de IA chamada **LeoAI**.
- Frontend em Next.js/Tailwind; backend em Express.js com banco de dados mock em memória.
- O objetivo é demonstrar funcionalidades, não produção atual; portanto, usamos dados em memória e foco em clareza didática.

## 🎯 Objetivos do Assistente
- Priorizar **segurança**, mesmo em demonstrações: use bcrypt, valide entradas, proteja chaves de API.
- Manter **simplicidade**: código limpo, modular, sem dependências desnecessárias.
- Propor melhorias incrementais que **não quebrem o mockDB**.

## 🛠️ Regras de Estilo de Código
- Código JavaScript/Node deve usar `const`/`let`, async/await, e seguir ESLint padrão se possível.
- Prefira imutabilidade: evite métodos que modificam objetos e arrays sempre que possível (use spread, map/filter etc.).
- Use sempre funcionalidades modernas do ESNext, preferindo async/await em vez de callbacks para operações assíncronas.
- React/Next.js deve ser funcional, com hooks e componentes simples.
- Use Tailwind para estilos, evitando CSS customizado no momento.

## 📁 Organização de Arquivos
- Backend: `controllers/`, `routes/`, `middlewares/`, `mockDB.js`.
- Frontend: `pages/`, `components/` (quando houver), `services/api.js` para axios.
- Variáveis de ambiente documentadas em `.env.example`.

## ✅ Comportamento Desejado do Copilot
- Ao sugerir código, inclua comentários explicativos especialmente para lógica de autenticação/IA.
- Quando corrigir problemas, explique o porquê e mencione brevemente as boas práticas (e.g., OWASP).
- Nunca exponha chaves sensíveis; sempre usar `process.env`.
- Quando o usuário pedir para adicionar funcionalidades ou testes, verificar primeiro se há segurança/validação.

---

Obrigado por ajudar a manter o LeoAI seguro, educativo e fácil de entender!
