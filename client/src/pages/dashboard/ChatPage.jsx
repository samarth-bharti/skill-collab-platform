import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Send, 
  User, 
  MessageCircle, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  Video, 
  X,
  AlertTriangle
} from "lucide-react";
import { 
  sendMessage, 
  getConversation, 
  getAllUsers,
  getUserConversations,
  getUserProfile,
  searchUsers,
  getFeaturedUsers
} from "../../lib/api";

const FEATURED_USERS_COUNT = 8;

const ErrorDisplay = ({ message }) => {
  if (!message) return null;
  return (
    <div className="p-4 my-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
      <AlertTriangle className="inline w-4 h-4 mr-2" />
      <span className="font-medium">Error:</span> {message}
    </div>
  );
};

export default function ChatPage() {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [activePartnerProfile, setActivePartnerProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  
  // UI States
  const [showUserDiscovery, setShowUserDiscovery] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const handleUserSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setSearchLoading(true);
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError("Failed to search for users.");
    } finally {
      setSearchLoading(false);
    }
  }, [searchQuery]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [users, featured] = await Promise.all([
        getAllUsers(),
        getFeaturedUsers(FEATURED_USERS_COUNT),
      ]);
      const otherUsers = users.filter(u => u.$id !== user.$id);
      setAllUsers(otherUsers);
      setFeaturedUsers(featured);
      await loadConversations(otherUsers);
    } catch (err) {
      setError("Failed to load initial chat data.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadConversations = useCallback(async (usersArray) => {
    try {
      const userConversations = await getUserConversations(user.$id);
      const availableUsers = usersArray || allUsers;
      
      const enrichedConversations = await Promise.all(
        userConversations.map(async (conversation) => {
          const otherUserId = conversation.otherUserId;
          let otherUser = availableUsers.find(u => u.$id === otherUserId);
          
          if (!otherUser) {
            try {
              otherUser = await getUserProfile(otherUserId);
            } catch {
              otherUser = {
                $id: otherUserId,
                fullName: `User ${otherUserId.slice(0, 8)}...`,
                email: 'Unknown User'
              };
            }
          }
          
          return {
            ...conversation,
            otherUser,
            lastMessage: conversation.content || 'No messages yet',
            lastMessageTime: conversation.createdAt || conversation.$createdAt,
            isUnread: !conversation.isRead && conversation.receiverId === user.$id
          };
        })
      );
      
      setConversations(enrichedConversations);
    } catch (err) {
      setError("Failed to load conversations.");
    }
  }, [user, allUsers]);

  const loadMessages = useCallback(async () => {
    if (!activePartnerId || !user) return;
    
    try {
      const conversation = await getConversation(user.$id, activePartnerId);
      setMessages(conversation);
      
      let partner = allUsers.find(u => u.$id === activePartnerId);
      
      if (!partner) {
        const existingConversation = conversations.find(c => c.otherUserId === activePartnerId);
        if (existingConversation && existingConversation.otherUser) {
          partner = existingConversation.otherUser;
        } else {
          try {
            partner = await getUserProfile(activePartnerId);
          } catch {
            partner = { 
              $id: activePartnerId, 
              fullName: `User ${activePartnerId.slice(0, 8)}...`,
              email: 'Unknown'
            };          
          }
        }
      }
      
      setActivePartnerProfile(partner);
    } catch (err) {
      setError("Failed to load messages.");
    }
  }, [activePartnerId, user, allUsers, conversations]);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user, loadInitialData]);

  useEffect(() => {
    if (activePartnerId && user) {
      loadMessages();
    }
  }, [activePartnerId, user, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      handleUserSearch();
    }, 300);
    return () => clearTimeout(searchTimeout);
  }, [searchQuery, handleUserSearch]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activePartnerId || sending) return;
    
    const content = messageInput.trim();
    setMessageInput("");
    setSending(true);
    
    try {
      const newMessage = await sendMessage(user.$id, activePartnerId, content);
      setMessages(prev => [...prev, newMessage]);
      await loadConversations();
    } catch (err) {
      setError("Failed to send message.");
      setMessageInput(content); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startChatWithUser = (selectedUser) => {
    setActivePartnerId(selectedUser.$id);
    setShowUserDiscovery(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const selectConversation = (conversation) => {
    setActivePartnerId(conversation.otherUserId);
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getUserDisplayName = (userObj) => {
    if (!userObj) return "Unknown User";
    return userObj.fullName || userObj.name || `User ${userObj.$id.slice(0, 8)}...`;
  };

  const memoizedConversations = useMemo(() => conversations.map((conversation) => (
    <button
      key={conversation.otherUserId}
      onClick={() => selectConversation(conversation)}
      className={`w-full p-3 rounded-lg text-left transition-colors ${
        activePartnerId === conversation.otherUserId
          ? 'bg-green-500/20 border-l-2 border-green-500'
          : 'hover:bg-gray-700/30'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-white truncate">
              {getUserDisplayName(conversation.otherUser)}
            </h3>
            <span className="text-xs text-gray-400">
              {formatMessageTime(conversation.lastMessageTime)}
            </span>
          </div>
          <p className="text-xs text-gray-400 truncate">
            {conversation.lastMessage}
          </p>
          {conversation.isUnread && (
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
          )}
        </div>
      </div>
    </button>
  )), [conversations, activePartnerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-green-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading secure channels...</h3>
          <p className="text-gray-400">Fetching conversations and contacts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex">
      {/* Left Sidebar - Conversations List */}
      <div className="w-80 bg-gray-900/50 border-r border-gray-700/50 backdrop-blur-sm flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-green-400" />
              Chats
            </h1>
            <button
              onClick={() => setShowUserDiscovery(!showUserDiscovery)}
              className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-gray-400">
            {conversations.length} active conversations
          </div>
        </div>

        {/* User Discovery Panel */}
        <AnimatePresence>
          {showUserDiscovery && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-gray-700/50 bg-gray-800/30"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-white">Start New Chat</h3>
                  <button
                    onClick={() => setShowUserDiscovery(false)}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Search Input */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-green-500/50 focus:outline-none"
                  />
                </div>

                {/* Search Results or Featured Users */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {searchQuery ? (
                    searchLoading ? (
                      <div className="text-center py-2 text-gray-400">Searching...</div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((userResult) => (
                        <button
                          key={userResult.$id}
                          onClick={() => startChatWithUser(userResult)}
                          className="w-full p-2 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-left transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {getUserDisplayName(userResult)}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {userResult.email || 'Developer'}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-2 text-gray-400">No users found</div>
                    )
                  ) : (
                    featuredUsers.map((featuredUser) => (
                      <button
                        key={featuredUser.$id}
                        onClick={() => startChatWithUser(featuredUser)}
                        className="w-full p-2 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {getUserDisplayName(featuredUser)}
                            </p>
                            <p className="text-xs text-gray-400">Available • Developer</p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {error && <ErrorDisplay message={error} />}
          {conversations.length > 0 ? (
            <div className="p-2 space-y-1">
              {memoizedConversations}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-6">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No conversations yet</h3>
                <p className="text-gray-400 mb-4">Start chatting with developers and creators</p>
                <button
                  onClick={() => setShowUserDiscovery(true)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  Start New Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activePartnerId && activePartnerProfile ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700/50 bg-gray-900/30 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="font-medium text-white">
                      {getUserDisplayName(activePartnerProfile)}
                    </h2>
                    <p className="text-sm text-gray-400">Online • Developer</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Start your conversation with {getUserDisplayName(activePartnerProfile)}</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.senderId === user.$id;
                  return (
                    <motion.div
                      key={message.$id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isOwn ? 'text-green-100' : 'text-gray-400'
                        }`}>
                          {formatMessageTime(message.createdAt || message.$createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700/50 bg-gray-900/30 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-green-500/50 focus:outline-none"
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sending}
                  className="p-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {sending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          // No chat selected
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Select a Chat</h2>
              <p className="text-gray-400 max-w-sm">
                Choose a conversation from the sidebar to start messaging, or create a new chat with other developers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
