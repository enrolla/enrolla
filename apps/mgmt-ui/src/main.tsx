import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import posthog from 'posthog-js';

import { AuthProvider } from '@propelauth/react';

import App from './App';

if (
  import.meta.env.VITE_POSTHOG_TOKEN &&
  import.meta.env.VITE_POSTHOG_TOKEN !== 'disabled'
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
