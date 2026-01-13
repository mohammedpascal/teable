import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import './styles/global.css';
import '@glideapps/glide-data-grid/dist/index.css';
import '@fontsource-variable/inter';

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

