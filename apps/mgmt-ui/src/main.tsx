import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { AuthProvider } from '@propelauth/react';

import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <AuthProvider authUrl={import.meta.env.VITE_PROPELAUTH_URL}>
      <App />
    </AuthProvider>
  </StrictMode>
);
