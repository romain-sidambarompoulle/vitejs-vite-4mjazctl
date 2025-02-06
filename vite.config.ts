import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/vitejs-vite-4mjazctl/", // Obligatoire pour GitHub Pages !
});
