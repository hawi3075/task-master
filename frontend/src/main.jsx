// frontend/src/main.jsx (UPDATED)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './AuthContext'; // NEW

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* WRAP HERE */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
);