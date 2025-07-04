import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

// Garante que o elemento root existe
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <div className="min-h-screen font-sans bg-gray-50 text-gray-900 flex flex-col">
        <App />
      </div>
    </Provider>
  </React.StrictMode>
);