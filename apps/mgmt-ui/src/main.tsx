import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import posthog from 'posthog-js';

import { AuthProvider } from '@propelauth/react';

import App from './App';

if (
  !window.location.host.includes('127.0.0.1') &&
  !window.location.host.includes('localhost') &&
  !window.location.host.includes('staging')
) {
  posthog.init(import.meta.env.VITE_POSTHOG_TOKEN, {
    api_host: 'https://app.posthog.com',
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    {import.meta.env.VITE_PROPELAUTH_URL && (
      <AuthProvider authUrl={import.meta.env.VITE_PROPELAUTH_URL}>
        <App />
      </AuthProvider>
    )}
    {!import.meta.env.VITE_PROPELAUTH_URL && <App />}
  </StrictMode>
);
