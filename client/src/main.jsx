// src/main.jsx

// --- DEBUG LINE ---
console.log("My Appwrite URL is:", import.meta.env.VITE_APPWRITE_URL);
// --- END DEBUG LINE ---

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);