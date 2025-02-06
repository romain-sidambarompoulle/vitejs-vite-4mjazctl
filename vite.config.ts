import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy'; // Importez le plugin

export default defineConfig({
  plugins: [
    react(),
    // Configurez le plugin pour copier le fichier _redirects
    viteStaticCopy({
      targets: [
        {
          src: 'public/_redirects', // Chemin du fichier _redirects dans le dossier public
          dest: '.', // Dossier de destination (le dossier de build)
        },
      ],
    }),
  ],
  base: "/vitejs-vite-4mjazctl/", // Obligatoire pour GitHub Pages !
});