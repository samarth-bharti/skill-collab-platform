import { account, databases, storage, ID, Query } from './appwrite';

// Environment variables with updated database ID
const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID || '68d835c8003e2d44a5f9';
const usersCollectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users';
const messagesCollectionId = import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID || 'messages';
const storageBucketId = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || 'profile-images';

console.log('API Configuration:', {
    dbId,
    usersCollectionId,
    messagesCollectionId,
    storageBucketId
});

// --- User Management ---
export const getUserProfile = async (userId) => {
    try {
        return await databases.getDocument(dbId, usersCollectionId, userId);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const createUserProfile = async (userId, profileData) => {
    try {
        return await databases.createDocument(dbId, usersCollectionId, userId, {
            userId,
            fullName: profileData.fullName,
            email: profileData.email,
            profilePicture: profileData.profilePicture || '',
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
};

export const getTeamMembers = async () => {
    try {
        const response = await databases.listDocuments(dbId, usersCollectionId);
        return response.documents;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await databases.listDocuments(dbId, usersCollectionId);
        return response.documents;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};

// --- Chat/Message Management (FIXED SYNTAX) ---
export const sendMessage = async (senderId, receiverId, content) => {
    try {
        // Create conversation ID (consistent for both users)
        const conversationId = [senderId, receiverId].sort().join('_');
        
        const messageData = {
            senderId,
            receiverId,
            content,
            conversationId,
            isRead: false,
            createdAt: new Date().toISOString()
        };

        console.log('💬 Sending message:', messageData);
        const message = await databases.createDocument(dbId, messagesCollectionId, ID.unique(), messageData);
        console.log('✅ Message sent successfully:', message.$id);
        return message;
    } catch (error) {
        console.error('❌ Error sending message:', error);
        throw error;
    }
};

export const getConversation = async (userId1, userId2, limit = 50) => {
    try {
        console.log('📥 Fetching conversation between:', userId1, 'and', userId2);
        const conversationId = [userId1, userId2].sort().join('_');
        
        // FIXED: Use Query.equal instead of string interpolation
        const response = await databases.listDocuments(
            dbId, 
            messagesCollectionId,
            [
                Query.equal("conversationId", conversationId),
                Query.orderDesc("createdAt"),
                Query.limit(limit)
            ]
        );
        
        // Reverse to show oldest first
        const messages = response.documents.reverse();
        console.log('✅ Loaded', messages.length, 'messages');
        return messages;
    } catch (error) {
        console.error('❌ Error fetching conversation:', error);
        throw error;
    }
};

export const getUserConversations = async (userId) => {
    try {
        console.log('💬 Fetching conversations for user:', userId);
        
        // FIXED: Use Query.or with proper array syntax
        const response = await databases.listDocuments(
            dbId,
            messagesCollectionId,
            [
                Query.or([
                    Query.equal("senderId", userId),
                    Query.equal("receiverId", userId)
                ]),
                Query.orderDesc("createdAt"),
                Query.limit(100)
            ]
        );

        // Group by conversation and get latest message for each
        const conversationMap = new Map();
        
        response.documents.forEach(message => {
            const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
            const existing = conversationMap.get(otherUserId);
            
            if (!existing || new Date(message.createdAt) > new Date(existing.createdAt)) {
                conversationMap.set(otherUserId, {
                    ...message,
                    otherUserId
                });
            }
        });

        const conversations = Array.from(conversationMap.values());
        console.log('✅ Found', conversations.length, 'conversations');
        return conversations;
    } catch (error) {
        console.error('❌ Error fetching conversations:', error);
        throw error;
    }
};

export const markMessageAsRead = async (messageId) => {
    try {
        return await databases.updateDocument(dbId, messagesCollectionId, messageId, {
            isRead: true
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
        throw error;
    }
};

export const getUnreadMessagesCount = async (userId) => {
    try {
        const response = await databases.listDocuments(dbId, messagesCollectionId, [
            Query.equal("receiverId", userId),
            Query.equal("isRead", false)
        ]);
        return response.total;
    } catch (error) {
        console.error('Error fetching unread messages count:', error);
        return 0;
    }
};

export const getUserSettings = async (userId) => {
    try {
        return await databases.getDocument(dbId, 'user_settings', userId);
    } catch (error) {
        console.error('Error fetching user settings:', error);
        throw error;
    }
};

export const updateUserSettings = async (userId, settings) => {
    try {
        return await databases.updateDocument(dbId, 'user_settings', userId, settings);
    } catch (error) {
        console.error('Error updating user settings:', error);
        throw error;
    }
};

export const getProjects = async () => {
    try {
        const response = await databases.listDocuments(dbId, 'projects');
        return response.documents;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const getProjectById = async (projectId) => {
    try {
        return await databases.getDocument(dbId, 'projects', projectId);
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        throw error;
    }
};

export const getTasksByProjectId = async (projectId) => {
    try {
        const response = await databases.listDocuments(
            dbId, 
            'tasks',
            [Query.equal("projectId", projectId)]
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching tasks by project ID:', error);
        throw error;
    }
};

// --- Chat Helper Functions ---
export const searchUsers = async (query, limit = 15) => {
    try {
        console.log('🔍 Searching users with query:', query);
        const users = await getAllUsers();
        
        if (!query || !query.trim()) {
            return [];
        }
        
        const filteredUsers = users.filter(user => {
            const fullName = (user.fullName || '').toLowerCase();
            const email = (user.email || '').toLowerCase();
            const searchTerm = query.toLowerCase().trim();
            
            return fullName.includes(searchTerm) || email.includes(searchTerm);
        });
        
        console.log('✅ Found', filteredUsers.length, 'users matching query');
        return filteredUsers.slice(0, limit);
    } catch (error) {
        console.error('❌ Error searching users:', error);
        throw error;
    }
};

export const getFeaturedUsers = async (limit = 8) => {
    try {
        console.log('⭐ Fetching featured users...');
        const users = await getAllUsers();
        
        const featuredUsers = users
            .sort((a, b) => new Date(b.createdAt || b.$createdAt) - new Date(a.createdAt || a.$createdAt))
            .slice(0, limit);
        
        console.log('✅ Loaded', featuredUsers.length, 'featured users');
        return featuredUsers;
    } catch (error) {
        console.error('❌ Error getting featured users:', error);
        throw error;
    }
};

// --- Direct Messaging Alias ---
export const sendDirectMessage = async (senderId, receiverId, content) => {
    return await sendMessage(senderId, receiverId, content);
};

// --- Storage Management ---
export const uploadProfilePicture = async (file) => {
    try {
        const uploadedFile = await storage.createFile(storageBucketId, ID.unique(), file);
        const fileUrl = storage.getFileView(storageBucketId, uploadedFile.$id);
        return { fileId: uploadedFile.$id, fileUrl };
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        throw error;
    }
};

// --- Password Recovery ---
export const requestPasswordReset = async (email) => {
    const resetUrl = `${window.location.origin}/reset-password`;
    try {
        return await account.createRecovery(email, resetUrl);
    } catch (error) {
        console.error('Failed to request password reset:', error);
        throw error;
    }
};

export const confirmPasswordReset = async (userId, secret, password) => {
    try {
        return await account.updateRecovery(userId, secret, password, password);
    } catch (error) {
        console.error('Failed to confirm password reset:', error);
        throw error;
    }
};

export const getMetrics = async () => {
    try {
        const response = await databases.listDocuments(dbId, 'metrics');
        return response.documents;
    } catch (error) {
        console.error('Error fetching metrics:', error);
        throw error;
    }
};

export const getNotifications = async () => {
    try {
        const response = await databases.listDocuments(dbId, 'notifications');
        return response.documents;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const getTimeline = async () => {
    try {
        const response = await databases.listDocuments(dbId, 'timeline');
        return response.documents;
    } catch (error) {
        console.error('Error fetching timeline:', error);
        throw error;
    }
};

export const getSkillVerifications = async () => {
    try {
        const response = await databases.listDocuments(dbId, 'skill_verifications');
        return response.documents;
    } catch (error) {
        console.error('Error fetching skill verifications:', error);
        throw error;
    }
};

export const getTasks = async () => {
    try {
        const response = await databases.listDocuments(dbId, 'tasks');
        return response.documents;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};
