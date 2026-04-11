import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, HelpCircle, BookOpen, Send, ChevronDown, Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const buildSupportReply = (message, userName) => {
    const normalized = message.toLowerCase();

    if (normalized.includes("password")) {
        return "In this frontend-only demo, password resets happen locally in your browser. Use the forgot-password flow and then open the reset page to update it.";
    }

    if (normalized.includes("project") || normalized.includes("join")) {
        return "Open Discover to browse collaborators and Projects to explore active workspaces. This demo keeps everything local, so you can explore freely without a backend.";
    }

    if (normalized.includes("profile") || normalized.includes("edit")) {
        return "You can update your profile from Settings or the profile builder. Changes are stored in localStorage so they stay on this browser.";
    }

    return `Thanks ${userName || 'there'} - this support chat is running fully on the frontend now. I can help with navigation, profile setup, or understanding the demo data.`;
};

const FAQItem = ({ faq, isOpen, onClick }) => (
    <li className="border-b border-gray-700 last:border-b-0">
        <button onClick={onClick} className="w-full text-left p-4 focus:outline-none">
            <div className="flex justify-between items-center">
                <span className="font-medium text-white">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="p-4 pt-0 text-gray-300">
                        {faq.answer}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </li>
);

export default function SupportPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("chat");
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: "agent", text: "Hi! This support center now runs fully on the frontend. How can I help?", timestamp: Date.now() },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);
    const messageEndRef = useRef(null);

    const handleSendMessage = useCallback(async () => {
        if (!input.trim() || !user) return;

        const currentInput = input.trim();
        const userMessage = {
            id: Date.now(),
            sender: "user",
            text: currentInput,
            timestamp: Date.now(),
        };

        setChatMessages((msgs) => [...msgs, userMessage]);
        setInput("");
        setIsTyping(true);
        setError(null);

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const botMessage = {
                id: Date.now() + 1,
                sender: "agent",
                text: buildSupportReply(currentInput, user.name),
                timestamp: Date.now(),
            };
            setChatMessages((msgs) => [...msgs, botMessage]);
        } catch {
            setError("The local support assistant could not answer right now. Please try again.");
        } finally {
            setIsTyping(false);
        }
    }, [input, user]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const tabs = [
        { id: "chat", label: "Live Chat", icon: MessageSquare },
        { id: "faq", label: "FAQs", icon: HelpCircle },
        { id: "tickets", label: "Support Tickets", icon: BookOpen },
    ];

    const faqs = [
        {
            question: "How do I reset my password?",
            answer: "Use the forgot-password page. In this frontend-only version, the reset request and password update are saved locally in your browser.",
        },
        {
            question: "How do I join a project?",
            answer: "Browse projects in Discover or Projects, then use the demo workflow to explore collaborators and project detail pages.",
        },
    ];

    return (
        <main className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-black text-white flex flex-col rounded-lg shadow-xl max-w-7xl mx-auto">
            <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-4xl font-semibold tracking-tight">Support Center</h1>
                <nav className="flex gap-3 flex-wrap" role="tablist">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveTab(id)}
                            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-medium transition ${
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

            {error && (
                <div className="p-4 my-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                    <span className="font-medium">Error:</span> {error}
                </div>
            )}

            <section className="flex-grow flex flex-col rounded-lg overflow-hidden border border-gray-700 bg-gray-900 shadow-inner">
                {activeTab === "chat" && (
                    <>
                        <div
                            className="flex-grow p-6 overflow-auto space-y-5"
                            style={{ scrollbarWidth: "thin" }}
                            role="tabpanel"
                            id="chat-panel"
                            aria-labelledby="chat-tab"
                        >
                            {chatMessages.map(({ id, sender, text }, idx) => (
                                <motion.div
                                    key={id}
                                    className={`flex max-w-[70%] ${sender === "user" ? "ml-auto justify-end" : "mr-auto justify-start"}`}
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

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="flex items-center gap-4 border-t border-gray-700 p-4"
                        >
                            <textarea
                                rows={1}
                                placeholder="Type your message..."
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
                                disabled={!input.trim() || isTyping}
                                aria-label="Send message"
                                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 rounded-lg px-6 py-3 font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isTyping ? <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div> : <Send />}
                            </button>
                        </form>
                    </>
                )}

                {activeTab === "faq" && (
                    <div className="overflow-auto p-6" role="tabpanel" id="faq-panel" aria-labelledby="faq-tab">
                        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
                        <ul className="bg-gray-800 rounded-lg border border-gray-700">
                            {faqs.map((faq, idx) => (
                                <FAQItem key={idx} faq={faq} isOpen={openFaq === idx} onClick={() => setOpenFaq(openFaq === idx ? null : idx)} />
                            ))}
                        </ul>
                    </div>
                )}

                {activeTab === "tickets" && (
                    <div className="overflow-auto p-6" role="tabpanel" id="tickets-panel" aria-labelledby="tickets-tab">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Your Support Tickets</h2>
                            <button className="bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Create New Ticket
                            </button>
                        </div>
                        <ul className="space-y-6">
                            {[
                                { id: 1, subject: "Question about local demo data", status: "Open", updated: "2 hours ago" },
                                { id: 2, subject: "Need help editing profile", status: "Closed", updated: "3 days ago" },
                            ].map(({ id, subject, status, updated }) => (
                                <li key={id} className="bg-gray-800 rounded-lg p-4 shadow-md flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold">{subject}</h3>
                                        <p className="text-gray-400 text-sm">Last updated {updated}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full font-bold text-sm ${
                                            status === "Open" ? "bg-green-600 text-black" : "bg-gray-600 text-gray-300"
                                        }`}
                                    >
                                        {status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </main>
    );
}
