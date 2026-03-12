import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import axios from 'axios';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! I am your Swasthya Parivar assistant. Ask me about reward points, eligibility, or benefits!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', {
                question: userMessage,
                language: 'English'
            });
            setMessages(prev => [...prev, { role: 'bot', content: response.data.answer }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I am having trouble connecting to the server right now." }]);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-[350px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10">

                    {/* Header */}
                    <div className="bg-accent/10 p-4 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[#0a0a1a]">
                                <Bot size={18} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Reward Assistant</h3>
                                <p className="text-[10px] text-gray-400">Ask me about rewards & benefits</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                                    ? 'bg-white/10 text-white'
                                    : 'bg-accent/20 text-accent'
                                    }`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-accent text-[#0a0a1a] rounded-tr-none'
                                    : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about rewards..."
                                className="w-full bg-black/20 text-white placeholder-gray-500 border border-white/10 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-accent/50 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-[#0a0a1a] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-[#0a0a1a] transition-all hover:scale-110 active:scale-95 ${isOpen ? 'bg-gray-700 text-white rotate-90' : 'bg-accent animate-bounce-slow'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
};

export default ChatBot;
