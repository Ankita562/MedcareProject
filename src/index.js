import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 👇 CHANGE THIS IMPORT
import { HashRouter } from 'react-router-dom'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 👇 USE HASHROUTER HERE */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);