const express = require("express");
const router = express.Router();
const { 
  generateText, 
  createChat, 
  listChats, 
  deleteChat, 
  getChat 
} = require("../controllers/aiController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rota para criar novo chat
router.post("/chats", authMiddleware, createChat);

// Rota para listar todos os chats do usuário
router.get("/chats", authMiddleware, listChats);

// Rota para obter um chat específico
router.get("/chats/:chatId", authMiddleware, getChat);

// Rota para deletar um chat
router.delete("/chats/:chatId", authMiddleware, deleteChat);

// Rota para gerar texto (agora com suporte a chatId)
router.post("/generate", authMiddleware, generateText);

module.exports = router;
