import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, HelpCircle, BookOpen, Send, ChevronDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

export default function SupportPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("chat");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "agent", text: "Hi! How can I assist you today?", timestamp: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
      timestamp: Date.now(),
    };

    setChatMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input.trim(),
      });

      const botMessage = {
        id: Date.now() + 1,
        sender: "agent",
        text: response.data.response,
        timestamp: Date.now(),
      };

      setChatMessages((msgs) => [...msgs, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: "agent",
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        timestamp: Date.now(),
      };
      setChatMessages((msgs) => [...msgs, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const tabs = [
    { id: "chat", label: "Live Chat", icon: MessageSquare },
    { id: "faq", label: "FAQs", icon: HelpCircle },
    { id: "tickets", label: "Support Tickets", icon: BookOpen },
  ];

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-black text-white flex flex-col rounded-lg shadow-xl max-w-7xl mx-auto">
      {/* Header with tab navigation */}
      <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">Support Center</h1>
        <nav className="flex gap-3 flex-wrap" role="tablist">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-medium transition 
                ${
                  activeTab === id
                    ? "bg-green-600 text-black shadow-lg"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-400"
                }`}
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`${id}-panel`}
              id={`${id}-tab`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* Tab panels */}
      <section className="flex-grow flex flex-col rounded-lg overflow-hidden border border-gray-700 bg-gray-900 shadow-inner">
        {activeTab === "chat" && (
          <>
            {/* Chat message area */}
            <div
              className="flex-grow p-6 overflow-auto space-y-5"
              style={{ scrollbarWidth: "thin" }}
              role="tabpanel"
              id="chat-panel"
              aria-labelledby="chat-tab"
            >
              {chatMessages.length === 0 && (
                <p className="text-gray-500 select-none text-center mt-20">
                  No messages yet. Start the conversation!
                </p>
              )}
              {chatMessages.map(({ id, sender, text }, idx) => (
                <motion.div
                  key={id}
                  className={`flex max-w-[70%] ${
                    sender === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
                  }`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <div
                    className={`rounded-xl px-5 py-4 break-words whitespace-pre-wrap ${
                      sender === "user"
                        ? "bg-green-500 text-black shadow-lg rounded-br-none"
                        : "bg-gray-700 text-white shadow-md rounded-bl-none"
                    }`}
                  >
                    {text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  className="flex mr-auto justify-start"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rounded-xl px-5 py-4 break-words whitespace-pre-wrap bg-gray-700 text-white shadow-md rounded-bl-none">
                    Typing...
                  </div>
                </motion.div>
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Input area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-4 border-t border-gray-700 p-4"
            >
              <textarea
                rows={1}
                placeholder="Type your message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                aria-label="Message input"
                className="flex-grow resize-none rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 rounded-lg px-6 py-3 font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send />
              </button>
            </form>
          </>
        )}

        {activeTab === "faq" && (
          <div
            className="overflow-auto p-6"
            role="tabpanel"
            id="faq-panel"
            aria-labelledby="faq-tab"
          >
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <ul className="space-y-4">
              {[
                {
                  question: "How do I reset my password?",
                  answer:
                    "Go to your account settings and click 'Reset Password'. Follow the instructions sent to your email.",
                },
                {
                  question: "How do I join a project?",
                  answer:
                    "Browse projects in the Discover section and request to join from the project page.",
                },
                // Add more FAQ items here
              ].map(({ question, answer }, idx) => (
                <li key={idx}>
                  <details className="group bg-gray-800 rounded-lg p-4" open={false}>
                    <summary className="flex justify-between cursor-pointer font-medium text-lg text-white select-none group-open:[&>svg]:rotate-90 transition-transform">
                      <span>{question}</span>
                      <ChevronDown className="w-5 h-5 text-gray-400 transition-transform" />
                    </summary>
                    <p className="mt-2 text-gray-300">{answer}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "tickets" && (
          <div
            className="overflow-auto p-6"
            role="tabpanel"
            id="tickets-panel"
            aria-labelledby="tickets-tab"
          >
            <h2 className="text-2xl font-semibold mb-6">Your Support Tickets</h2>
            <ul className="space-y-6">
              {[
                { id: 1, subject: "Issue logging in", status: "Open", updated: "2 hours ago" },
                { id: 2, subject: "Project sync error", status: "Closed", updated: "3 days ago" },
              ].map(({ id, subject, status, updated }) => (
                <li key={id} className="bg-gray-800 rounded-lg p-4 shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{subject}</h3>
                    <p className="text-gray-400 text-sm">Last updated {updated}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full font-bold text-sm ${
                      status === "Open"
                        ? "bg-green-600 text-black"
                        : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    {status}
                  </span>
                </li>
              ))}
            </ul>
            <button className="mt-8 bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-lg font-bold w-full max-w-xs mx-auto">
              Create New Ticket
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
