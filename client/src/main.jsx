// src/main.jsx

// --- DEBUG LINE ---
console.log("My Appwrite ENDPOINT is:", import.meta.env.VITE_APPWRITE_ENDPOINT);
console.log("My Appwrite PROJECT_ID is:", import.meta.env.VITE_APPWRITE_PROJECT_ID);
// --- END DEBUG LINE ---

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
