import { useState } from 'react';

export const useChat = (agentId, onSuggestion) => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: `Hola Seba, soy tu tutor especializado en ${agentId}. ¿Qué resolveremos hoy?`, time: '0.1s' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (query, image) => {
    if (!query.trim() && !image) return;

    const userMsg = { id: Date.now(), role: 'user', text: query, hasImage: !!image };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query, 
          image, 
          agentId, 
          rut: 'SEBA-001' 
        })
      });
      
      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      
      let currentText = "";
      const aiMsgId = Date.now() + 1;
      setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', text: '', time: resData.responseTime || "0.4s" }]);
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < resData.answer.length) {
          currentText += resData.answer[index];
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: currentText } : m));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          if (resData.suggestedAgent) onSuggestion(resData.suggestedAgent);
        }
      }, 20);
    } catch (e) {
      console.error("API Error:", e);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        role: 'ai', 
        text: "Error de conexión con el backend local. Verifica que el servidor de Node esté corriendo en el puerto 3000." 
      }]);
      setIsTyping(false);
    }
  };

  return {
    messages,
    isTyping,
    sendMessage
  };
};
