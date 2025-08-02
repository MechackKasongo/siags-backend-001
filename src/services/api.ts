import axios from 'axios';
import type {AuthContextType} from '../contexts/AuthContext';

/**
 * Configure l'URL de base pour l'API.
 * En mode développement (vite dev), la valeur de VITE_API_BASE_URL est généralement vide ou une
 * URL relative comme '/api/v1', qui sera gérée par le proxy de Vite.
 * En mode production (vite build), VITE_API_BASE_URL doit être définie (par exemple, dans un fichier .env.production)
 * pour pointer vers l'URL réelle du backend (ex: 'https://api.votredomaine.com/api/v1').
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT aux requêtes
let authContextRef: AuthContextType | null = null;

export const setAuthContextRef = (ref: AuthContextType) => {
    authContextRef = ref;
};

api.interceptors.request.use(
    (config) => {
        // Récupère le token depuis le contexte d'authentification ou le localStorage
        const token = authContextRef?.jwtToken || localStorage.getItem('jwtToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Gérer les erreurs 401 (Unauthorized) ou 403 (Forbidden)
        if (error.response?.status === 401 && originalRequest.url !== '/auth/signin') {
            // Si le token est expiré ou invalide et ce n'est pas une requête de login
            console.warn("Token expiré ou invalide. Déconnexion de l'utilisateur.");
            if (authContextRef) {
                authContextRef.logout(); // Déconnecter l'utilisateur via le contexte
            }
            return Promise.reject(error); // Rejeter l'erreur pour la capturer dans le composant
        }
        return Promise.reject(error);
    }
);

export default api;