import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./output.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='min-h-screen bg-gradient-to-b from-slate-700 to-green-600 flex items-center justify-center'>
      <App/>
    </div>
  </React.StrictMode>
);