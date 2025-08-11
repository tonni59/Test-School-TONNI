/// <reference types="vite/client" />

// Add all env variables your frontend expects here
interface ImportMetaEnv {
  readonly VITE_API_URL: string;   // e.g. "https://api.example.com"
  // add other VITE_ variables you use:
  // readonly VITE_OTHER_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
