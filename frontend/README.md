Frontend README

1) Copy .env.example to .env and set VITE_API_URL to your deployed backend base URL (e.g. https://api.example.com)

2) Install dependencies:
   npm install

3) Run locally:
   npm run start

4) Build for production:
   npm run build

Notes about deployment:
- Frontend will talk to backend at REACT_APP_API_URL (Vite: VITE_API_URL)
- Replace placeholder URLs in this README and .env for production deployments.
