import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { ConfigEnv, UserConfig } from 'vite';

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  // Charger les variables d'environnement en fonction du mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: "./", // Conserver cette configuration pour GitHub Pages
    server: {
      proxy: {
        // En mode développement, proxyfier les requêtes API
        ...(mode === 'development' ? {
          '/api': {
            target: env.VITE_API_BASEURL,
            changeOrigin: true,
            secure: false,
            // Ajouter des en-têtes CORS à la réponse proxy
            configure: (proxy, _options) => {
              proxy.on('proxyRes', (proxyRes) => {
                proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, CSRF-Token, Cache-Control, Pragma, Expires';
              });
            }
          },
          '/chatbot': {
            target: env.VITE_API_BASEURL,
            changeOrigin: true,
            secure: false
          },
          '/submit-form': {
            target: env.VITE_API_BASEURL,
            changeOrigin: true,
            secure: false
          }
        } : {})
      }
    }
  };
});
