import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Le port sur lequel votre frontend s'exécute (par défaut 5173 ou 3000)
    proxy: {
      // Toutes les requêtes qui commencent par '/api' seront redirigées vers votre backend
      // Exemple : une requête vers /api/v1/patients sera redirigée vers http://localhost:8080/api/v1/patients
      '/api': {
        target: 'http://localhost:8080', // L'URL de base de votre backend Spring Boot
        changeOrigin: true, // Nécessaire pour les hôtes virtuels
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Réécrit le chemin (ici, conserve /api)
        // secure: false, // Décommenter si votre backend utilise HTTPS mais que votre certificat est auto-signé (pour le dev)
      },
    },
  },
});


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
//
// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
