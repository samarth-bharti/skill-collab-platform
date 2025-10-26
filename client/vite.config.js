import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on mode in the current working directory
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('Vite Config - Loading environment variables:');
  console.log('Mode:', mode);
  console.log('VITE_APPWRITE_ENDPOINT:', env.VITE_APPWRITE_ENDPOINT);
  console.log('VITE_APPWRITE_PROJECT_ID:', env.VITE_APPWRITE_PROJECT_ID);
  console.log('VITE_APPWRITE_DATABASE_ID:', env.VITE_APPWRITE_DATABASE_ID);
  
  return {
    plugins: [react()],
    // Force load environment variables
    define: {
      'import.meta.env.VITE_APPWRITE_ENDPOINT': JSON.stringify(env.VITE_APPWRITE_ENDPOINT),
      'import.meta.env.VITE_APPWRITE_PROJECT_ID': JSON.stringify(env.VITE_APPWRITE_PROJECT_ID),
      'import.meta.env.VITE_APPWRITE_DATABASE_ID': JSON.stringify(env.VITE_APPWRITE_DATABASE_ID),
      'import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID': JSON.stringify(env.VITE_APPWRITE_USERS_COLLECTION_ID),
      'import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID': JSON.stringify(env.VITE_APPWRITE_MESSAGES_COLLECTION_ID),
      'import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID': JSON.stringify(env.VITE_APPWRITE_STORAGE_BUCKET_ID),
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
