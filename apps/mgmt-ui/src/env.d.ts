interface ImportMetaEnv {
  readonly VITE_PROPELAUTH_URL: string;
  readonly VITE_BACKEND_URL: string;
  readonly VITE_POSTHOG_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
