import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm GreenCycle AI. How can I help you today? Do you want to know about scrap prices or how to book a pickup?", sender: "bot" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');

        // Add user message to UI immediately
        const newMessages = [...messages, { id: Date.now(), text: userMsg, sender: "user" }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/ai/chat`, { message: userMsg });
            setMessages([...newMessages, { id: Date.now() + 1, text: res.data.reply, sender: "bot" }]);
        } catch (err) {
            console.error("Chat error", err);
            setMessages([...newMessages, { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting right now. Please try again later. Alternatively, you can directly check prices or book a pickup from the home page.", sender: "bot" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="mb-4 w-80 sm:w-96 bg-bgDark-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        style={{ height: '500px', maxHeight: '80vh' }}
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <Bot size={24} />
                                <h3 className="font-bold font-outfit">GreenCycle AI</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-primary-hover p-1 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bgDark">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                                            ? 'bg-primary text-white rounded-tr-sm'
                                            : 'bg-bgDark-paper border border-white/5 text-gray-300 rounded-tl-sm'
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-bgDark-paper border border-white/5 text-gray-300 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-primary" />
                                        <span className="text-xs">Typing...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 bg-bgDark-card border-t border-white/10 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-bgDark border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-primary-hover transition-colors flex-shrink-0"
                            >
                                <Send size={18} className="ml-0.5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center text-white transition-colors duration-300 ${isOpen ? 'bg-bgDark-paper border border-white/10 text-gray-400' : 'bg-primary hover:bg-primary-hover'}`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
