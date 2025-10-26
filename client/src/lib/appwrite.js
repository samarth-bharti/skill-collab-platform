// src/lib/appwrite.js

import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

// --- PASTE YOUR IDS HERE ---
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1'; // Or your self-hosted endpoint
const APPWRITE_PROJECT_ID = '68d833720008be671c81';          // Find this in your Appwrite project settings
export const DATABASE_ID = '68d835c8003e2d44a5f9';               // The Database ID you created
export const USERS_COLLECTION_ID = 'users';                     // Your users collection ID
export const PROJECTS_COLLECTION_ID = 'projects';               // Your projects collection ID
export const TASKS_COLLECTION_ID = 'tasks';                     // Your tasks collection ID
export const TEAM_MEMBERS_COLLECTION_ID = 'team_members';         // Your team members collection ID
export const SKILL_VERIFICATIONS_COLLECTION_ID = 'skill_verifications'; // Your skill verifications collection ID
export const TIMELINE_COLLECTION_ID = 'timeline';               // Your timeline collection ID
export const NOTIFICATIONS_COLLECTION_ID = 'notifications';         // Your notifications collection ID
export const METRICS_COLLECTION_ID = 'metrics';                 // Your metrics collection ID
// ----------------------------

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

// Export Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };