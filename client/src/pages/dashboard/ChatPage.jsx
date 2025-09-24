import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { mockUsers, mockMessages } from "../../api/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, MoreHorizontal, User } from "lucide-react";

export default function ChatPage() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [allMessages, setAllMessages] = useState(mockMessages);
  const messagesEndRef = useRef(null);

  const contacts = mockUsers.filter((u) => u.id !== user.id);

  useEffect(() => {
    if (!activeChat && contacts.length > 0) {
      setActiveChat(contacts[0].id);
    }
  }, [contacts, activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat, allMessages]);

  const messages = allMessages[activeChat] || [];
  const activeContact = mockUsers.find((u) => u.id === activeChat);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: user.id,
      text: messageInput.trim(),
      timestamp: new Date().toISOString(),
    };
    setAllMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }));
    setMessageInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#121212] to-[#1a1a1a] text-white rounded-lg shadow-xl overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar Contact List */}
        <aside className="w-72 bg-[#222] border-r border-zinc-700 flex flex-col">
          <header className="flex items-center px-6 py-4 border-b border-zinc-700 justify-between">
            <h2 className="font-semibold text-xl tracking-wide select-none">Messages</h2>
            <button
              className="text-green-500 hover:text-green-400"
              aria-label="New chat"
              title="New chat (you can extend this)"
            >
              +
            </button>
          </header>
          <div className="flex items-center px-4 py-3 border-b border-zinc-700 bg-[#1E1E1E]">
            <Search className="w-5 h-5 text-zinc-500" />
            <input
              type="search"
              placeholder="Search..."
              className="ml-3 w-full bg-transparent placeholder-zinc-500 text-white py-1 focus:outline-none"
              onChange={(e) => {
                // Add search logic if needed
              }}
            />
          </div>
          <nav className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-900">
            {contacts.map((contact) => {
              const lastMsg = (allMessages[contact.id]?.slice(-1)[0]?.text) || "No messages yet";
              const isActive = contact.id === activeChat;
              return (
                <button
                  key={contact.id}
                  onClick={() => setActiveChat(contact.id)}
                  className={`flex items-center gap-4 w-full px-6 py-4 text-left border-l-4 ${
                    isActive ? "border-green-500 bg-green-900/20" : "border-transparent hover:bg-zinc-800"
                  } focus:outline-none transition-colors`}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-800 flex items-center justify-center font-semibold text-lg select-none">
                    {contact.avatar}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className={`truncate text-white ${isActive ? "font-bold" : "font-semibold"}`}>
                      {contact.name}
                    </span>
                    <span className="text-sm text-zinc-400 truncate">{lastMsg}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Chat Window */}
        <section className="flex flex-col flex-grow border border-zinc-700 rounded-r-lg bg-[#1F1F1F]">
          {activeContact ? (
            <>
              <header className="flex items-center gap-4 px-6 py-4 border-b border-zinc-700">
                <div className="w-12 h-12 rounded-full bg-green-800 flex items-center justify-center font-semibold text-lg select-none">
                  {activeContact.avatar}
                </div>
                <h3 className="font-semibold text-2xl">{activeContact.name}</h3>
                <motion.button
                  className="ml-auto p-1 rounded-md text-zinc-400 hover:text-green-400 hover:bg-zinc-800 transition-colors"
                  aria-label="Chat options"
                >
                  <MoreHorizontal />
                </motion.button>
              </header>

              <main className="flex flex-col flex-grow px-6 py-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-900">
                {messages.length === 0 && (
                  <p className="text-center text-zinc-500 select-none">No conversation history yet</p>
                )}
                {messages.map(({ id, text, sender }) => {
                  const isUser = sender === user.id;
                  const senderUser = mockUsers.find((u) => u.id === sender);
                  return (
                    <div
                      key={id}
                      className={`flex items-end max-w-[70%] ${
                        isUser ? "justify-end ml-auto" : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-800 flex items-center justify-center font-semibold text-xs select-none mr-2">
                          {senderUser?.avatar || "?"}
                        </div>
                      )}
                      <motion.div
                        className={`p-3 rounded-2xl break-words whitespace-pre-wrap ${
                          isUser
                            ? "bg-green-500 text-black rounded-br-none"
                            : "bg-zinc-700 text-white rounded-bl-none"
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {text}
                      </motion.div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </main>

              <footer className="p-4 border-t border-zinc-700 flex items-center gap-3 bg-[#181818]">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-grow resize-none rounded-lg bg-[#2d2d2d] px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: !messageInput.trim() ? 1 : 1.05 }}
                  className={`bg-green-500 rounded-lg px-5 py-3 font-semibold text-black transition disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </footer>
            </>
          ) : (
            <div className="flex items-center justify-center flex-grow text-zinc-500 select-none">
              Select a conversation to start chatting
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
