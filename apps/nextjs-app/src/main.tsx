import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Render the app
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

