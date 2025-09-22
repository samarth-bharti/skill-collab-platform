// src/lib/appwrite.js
import { Client, Account, Databases, Storage } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();

client
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('68c998fe000a851c62e9');

// Export the services you'll use
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
