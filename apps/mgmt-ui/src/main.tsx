import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { AuthProvider } from '@propelauth/react';

import App from './App';

// Yep, it's ugly, but Vercel doesn't provide an easy way to separate our staging and production environments.
// Will refactor soon (famous last words).
const monkeyPatchPropelAuthUrl = () => {
  if (window.location.href.startsWith('https://app-staging.vecinity.io')) {
    return 'https://auth.vecinity.io';
  } else {
    return import.meta.env.VITE_PROPELAUTH_URL;
  }
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    {import.meta.env.VITE_PROPELAUTH_URL && (
      <AuthProvider authUrl={monkeyPatchPropelAuthUrl()}>
        <App />
      </AuthProvider>
    )}
    {!import.meta.env.VITE_PROPELAUTH_URL && <App />}
  </StrictMode>
);
