// src/lib/appwrite.js

import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

export const API_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
export const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const PROJECTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;
export const TASKS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID;
export const TEAM_MEMBERS_COLLECTION_ID = 'team_members';
export const SKILL_VERIFICATIONS_COLLECTION_ID = 'skill_verifications';
export const TIMELINE_COLLECTION_ID = 'timeline';
export const NOTIFICATIONS_COLLECTION_ID = 'notifications';
export const METRICS_COLLECTION_ID = 'metrics';

const client = new Client()
    .setEndpoint(API_ENDPOINT)
    .setProject(PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };