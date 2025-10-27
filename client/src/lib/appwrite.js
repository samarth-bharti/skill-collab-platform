// src/lib/appwrite.js

import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

// --- PASTE YOUR IDS HERE ---
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1'; // Or your self-hosted endpoint
const APPWRITE_PROJECT_ID = '68d833720008be671c81';          // Find this in your Appwrite project settings
export const DATABASE_ID = '68d835c8003e2d44a5f9';               // The Database ID you created
export const USERS_COLLECTION_ID = 'user';                     // Your users collection ID
export const PROJECTS_COLLECTION_ID = 'project';               // Your projects collection ID
// ----------------------------

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };