import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/vitejs-vite-4mjazctl/", // Ajoute le nom du dépôt ici
});
