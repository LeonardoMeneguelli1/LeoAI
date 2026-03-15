import { useState, useEffect } from "react";
import api from "../services/api";
import { FaPaperPlane, FaEllipsisV, FaRobot, FaSignOutAlt, FaTrash } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Chat() {
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpenForChat, setMenuOpenForChat] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      console.log("📋 Carregando chats...");
      const res = await api.get("/ai/chats");
      setChats(res.data);
      console.log("✅ Chats carregados:", res.data.length);

      // Se houver chats, abre o primeiro
      if (res.data.length > 0) {
        openChat(res.data[0].id);
      }
    } catch (err) {
      console.error("❌ Erro ao carregar chats:", err.response?.data || err.message);
    }
  };

  const createNewChat = async () => {
    try {
      console.log("➕ Criando novo chat...");
      const res = await api.post("/ai/chats");
      
      const newChat = res.data;
      setChats(prev => [newChat, ...prev]);
      openChat(newChat.id);
      
      console.log("✅ Novo chat criado:", newChat.id);
    } catch (err) {
      console.error("❌ Erro ao criar chat:", err.response?.data || err.message);
    }
  };

  const openChat = async (id) => {
    try {
      console.log("📂 Abrindo chat:", id);
      
      // Se é o mesmo chat, não recarrega
      if (chatId === id) return;
      
      const res = await api.get(`/ai/chats/${id}`);
      const chat = res.data;
      
      setChatId(id);
      setMessages(chat.messages);
      setMenuOpenForChat(null);
      
      console.log("✅ Chat aberto com", chat.messages.length, "mensagens");
    } catch (err) {
      console.error("❌ Erro ao abrir chat:", err.response?.data || err.message);
    }
  };

  const deleteChat = async (id) => {
    try {
      console.log("🗑️ Deletando chat:", id);
      
      await api.delete(`/ai/chats/${id}`);
      
      setChats(prev => prev.filter(c => c.id !== id));
      
      // Se deletou o chat atual, abre outro ou cria novo
      if (chatId === id) {
        if (chats.length > 1) {
          const nextChat = chats.find(c => c.id !== id);
          openChat(nextChat.id);
        } else {
          setChatId(null);
          setMessages([]);
        }
      }
      
      setMenuOpenForChat(null);
      console.log("✅ Chat deletado");
    } catch (err) {
      console.error("❌ Erro ao deletar chat:", err.response?.data || err.message);
    }
  };

  const sendPrompt = async () => {
    if (!prompt.trim() || !chatId) return;
    
    const userMessage = { 
      role: "user", 
      content: prompt, 
      date: new Date().toISOString() 
    };
    setMessages(prev => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    console.log("🚀 Enviando prompt:", prompt.substring(0, 50) + "...");

    try {
      const res = await api.post("/ai/generate", { 
        prompt,
        chatId 
      });

      console.log("✅ Resposta da IA recebida");

      // Atualiza a lista de chats para refletir o novo título
      if (res.data.chatTitle) {
        setChats(prev => prev.map(c => 
          c.id === chatId ? { ...c, title: res.data.chatTitle } : c
        ));
      }

      // Adiciona a resposta do assistente
      setMessages(prev => [...prev, res.data.message]);
    } catch (err) {
      console.error("❌ Erro na requisição:", err.response?.data || err.message);
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Erro ao gerar resposta: ${err.response?.data?.error || err.message}`,
        date: new Date().toISOString() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Sidebar estilo ChatGPT */}
      <aside className="w-64 bg-gray-900 p-4 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-800">
          <FaRobot className="text-green-400 text-2xl" />
          <span className="font-bold text-lg">LeoAI</span>
        </div>

        {/* Novo Chat */}
        <button 
          onClick={createNewChat}
          className="w-full mb-6 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-sm font-medium border border-gray-700"
        >
          + Novo Chat
        </button>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Histórico</h2>
          </div>
          
          {chats.length > 0 ? (
            <div className="space-y-2">
              {chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => openChat(chat.id)}
                  className={`p-3 rounded-lg cursor-pointer transition group relative ${
                    chatId === chat.id 
                      ? 'bg-gray-700 border border-green-500' 
                      : 'bg-gray-800 hover:bg-gray-750'
                  }`}
                >
                  <p className="truncate text-sm text-gray-300 group-hover:text-gray-200">
                    {chat.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {chat.messages?.length || 0} mensagens
                  </p>
                  
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenForChat(menuOpenForChat === chat.id ? null : chat.id);
                      }}
                      className="p-1 hover:bg-gray-700 rounded"
                    >
                      <FaEllipsisV className="text-xs text-gray-400" />
                    </button>
                    
                    {menuOpenForChat === chat.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded shadow-lg z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat.id);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-sm transition text-red-400 flex items-center space-x-2"
                        >
                          <FaTrash className="text-xs" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-600">Clique em "+ Novo Chat" para começar</p>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-sm border border-gray-700"
        >
          <FaSignOutAlt className="text-sm" />
          <span>Sair</span>
        </button>
      </aside>

      {/* Área principal */}
      <main className="flex-1 flex flex-col">
        {chatId ? (
          <>
            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <FaRobot className="text-6xl text-green-400 mb-4 opacity-50" />
                  <h2 className="text-3xl font-bold mb-2">Novo Chat</h2>
                  <p className="text-gray-400 text-center max-w-md">
                    Comece uma conversa digitando sua pergunta abaixo
                  </p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-2xl rounded-lg ${
                        msg.role === "user"
                          ? "bg-gray-800 text-white px-4 py-3"
                          : "text-gray-100"
                      }`}
                    >
                      {msg.html ? (
                        <div 
                          className="html-content"
                          dangerouslySetInnerHTML={{ __html: msg.html }}
                        />
                      ) : (
                        <div>{msg.content}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex space-x-2 p-4">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input fixo */}
            <div className="p-6 bg-gradient-to-t from-gray-950 to-transparent border-t border-gray-800">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-3">
                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    placeholder="Digite sua mensagem... (Shift+Enter para nova linha)"
                    className="flex-1 p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-800 transition"
                  />

                  {/* Botão de envio */}
                  <button
                    onClick={sendPrompt}
                    disabled={loading || !prompt.trim()}
                    className="px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition flex items-center justify-center hover:shadow-lg hover:shadow-green-500/20"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  LeoAI pode cometer erros. Sempre verifique as respostas importantes.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <FaRobot className="text-6xl text-green-400 mb-4 opacity-50" />
            <h2 className="text-3xl font-bold mb-2">Bem-vindo ao LeoAI</h2>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Clique em "+ Novo Chat" na sidebar para começar uma conversa
            </p>
            <button 
              onClick={createNewChat}
              className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition font-medium"
            >
              Criar novo chat
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
