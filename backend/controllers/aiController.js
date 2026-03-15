const fetch = require("node-fetch");
const db = require("../mockDB");
const MarkdownIt = require("markdown-it");

// Inicializa o parser markdown com suporte a tabelas e HTML
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
});

// Habilita markdown-it Table Plugin nativamente (já incluído)
md.enable('table');

// Função para converter Markdown para HTML
const markdownToHtml = (markdown) => {
  return md.render(markdown);
};

// Gera um ID único
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Criar novo chat
exports.createChat = (req, res) => {
  try {
    const email = req.user.email;
    const chatId = generateId();
    
    const newChat = {
      id: chatId,
      email,
      title: "Novo Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    db.chats.push(newChat);
    console.log("✅ Novo chat criado:", chatId);
    
    res.json(newChat);
  } catch (err) {
    console.error("Erro ao criar chat:", err.message);
    res.status(500).json({ error: "Erro ao criar chat: " + err.message });
  }
};

// Listar todos os chats do usuário
exports.listChats = (req, res) => {
  try {
    const email = req.user.email;
    const userChats = db.chats.filter(c => c.email === email);
    
    // Ordena por data de atualização (mais recentes primeiro)
    userChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    console.log("Listando chats do usuário:", email, "Total:", userChats.length);
    res.json(userChats);
  } catch (err) {
    console.error("Erro ao listar chats:", err.message);
    res.status(500).json({ error: "Erro ao listar chats: " + err.message });
  }
};

// Deletar um chat
exports.deleteChat = (req, res) => {
  try {
    const email = req.user.email;
    const { chatId } = req.params;
    
    const chatIndex = db.chats.findIndex(c => c.id === chatId && c.email === email);
    
    if (chatIndex === -1) {
      return res.status(404).json({ error: "Chat não encontrado" });
    }
    
    db.chats.splice(chatIndex, 1);
    console.log("🗑️ Chat deletado:", chatId);
    
    res.json({ success: true, message: "Chat deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar chat:", err.message);
    res.status(500).json({ error: "Erro ao deletar chat: " + err.message });
  }
};

// Obter um chat específico com suas mensagens
exports.getChat = (req, res) => {
  try {
    const email = req.user.email;
    const { chatId } = req.params;
    
    const chat = db.chats.find(c => c.id === chatId && c.email === email);
    
    if (!chat) {
      return res.status(404).json({ error: "Chat não encontrado" });
    }
    
    console.log("Chat obtido:", chatId, "Mensagens:", chat.messages.length);
    res.json(chat);
  } catch (err) {
    console.error("Erro ao obter chat:", err.message);
    res.status(500).json({ error: "Erro ao obter chat: " + err.message });
  }
};

// Gerar resposta da IA e adicionar ao chat
exports.generateText = async (req, res) => {
  try {
    const { prompt, chatId } = req.body;
    const email = req.user.email;

    console.log("Request recebido - Email:", email, "ChatId:", chatId);
    console.log("Prompt:", prompt);
    console.log("GEMINI_API_KEY existe?", !!process.env.GEMINI_API_KEY);

    // Encontra o chat
    const chat = db.chats.find(c => c.id === chatId && c.email === email);
    if (!chat) {
      return res.status(404).json({ error: "Chat não encontrado" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY não configurada" });
    }

    // Adiciona a mensagem do usuário no chat
    const userMessage = {
      id: generateId(),
      role: "user",
      content: prompt,
      html: null,
      date: new Date()
    };
    chat.messages.push(userMessage);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    console.log("Status da API Gemini:", response.status);

    if (!response.ok) {
      const text = await response.text();
      console.log("Gemini ERROR:", text);
      return res.status(500).json({ error: text });
    }

    const data = await response.json();
    console.log("Gemini RESPONSE recebida");

    let text = "Erro ao gerar texto";
    let htmlText = "<p>Erro ao gerar texto</p>";

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      text = data.candidates[0].content.parts[0].text;
      // Converte Markdown para HTML
      htmlText = markdownToHtml(text);
      console.log("Resposta convertida para HTML");
    }

    // Adiciona a resposta da IA no chat
    const assistantMessage = {
      id: generateId(),
      role: "assistant",
      content: text,
      html: htmlText,
      date: new Date()
    };
    chat.messages.push(assistantMessage);

    // Atualiza o título do chat se for vazio
    if (chat.title === "Novo Chat" && prompt.length > 0) {
      chat.title = prompt.substring(0, 50) + (prompt.length > 50 ? "..." : "");
    }

    // Atualiza a data de modificação
    chat.updatedAt = new Date();

    // Também salva no history para compatibilidade
    db.history.push({
      email,
      prompt,
      response: text,
      date: new Date(),
    });

    res.json({ 
      success: true,
      message: assistantMessage,
      chatTitle: chat.title 
    });
  } catch (err) {
    console.error("Erro no generateText:", err.message);
    res.status(500).json({ error: "Erro ao gerar resposta da IA: " + err.message });
  }
};
