// src/lib/api.js
import { account, databases, storage } from './appwrite';
import { ID } from 'appwrite';

// --- Environment Variables ---
const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const profilesCollectionId = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID;
const imagesBucketId = import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID;


// --- Profile Management ---

/**
 * Uploads a profile picture to Appwrite Storage.
 * @param {File} file The image file to upload.
 * @returns {Promise<object>} The Appwrite file object.
 */
export const uploadProfilePicture = async (file) => {
    try {
        const uploadedFile = await storage.createFile(
            imagesBucketId,
            ID.unique(),
            file
        );
        return uploadedFile;
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        throw error;
    }
};

/**
 * Creates a user profile document in the database.
 * @param {object} profileData The complete profile data.
 * @returns {Promise<object>} The Appwrite document object.
 */
export const createUserProfile = async (profileData) => {
    try {
        const newDocument = await databases.createDocument(
            dbId,
            profilesCollectionId,
            ID.unique(),
            profileData
        );
        return newDocument;
    } catch (error) {
        console.error("Error creating user profile document:", error);
        throw error;
    }
};


// --- Password Recovery ---

/**
 * Sends a password reset email to the user.
 * @param {string} email The user's email address.
 */
export const requestPasswordReset = async (email) => {
    // For production, consider moving this URL to your .env file
    const resetUrl = 'http://localhost:5173/reset-password';

    try {
        await account.createRecovery(email, resetUrl);
    } catch (error) {
        console.error("Failed to request password reset:", error);
        throw error;
    }
};

/**
 * Completes the password reset using the token from the email link.
 * @param {string} userId The user ID from the URL.
 * @param {string} secret The secret token from the URL.
 * @param {string} password The new password.
 */
export const confirmPasswordReset = async (userId, secret, password) => {
    try {
        await account.updateRecovery(userId, secret, password, password);
    } catch (error) {
        console.error("Failed to confirm password reset:", error);
        throw error;
    }
};