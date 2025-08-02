import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode

// 1. Définir l'interface de l'utilisateur (basée sur votre UserResponseDTO backend)
interface DecodedUserToken {
    id: number;
    username: string;
    email: string;
    nomComplet: string;
    roles: string[]; // Les rôles de votre backend
    exp: number; // Expiration du token
    iat: number; // Issued at
    // Ajoutez d'autres champs si votre JWT les contient
}

// 2. Définir l'interface pour le AuthContext
interface AuthContextType {
    user: DecodedUserToken | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

// 3. Créer le contexte avec un type par défaut
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Définir les props du fournisseur
interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<DecodedUserToken | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const API_BASE_URL = 'http://localhost:8080/api/v1/auth'; // Remplacez par l'URL de votre backend

    useEffect(() => {
        const loadUserFromLocalStorage = () => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (token) {
                    const decodedToken: DecodedUserToken = jwtDecode(token);
                    // Vérifiez l'expiration du token
                    if (decodedToken.exp * 1000 < Date.now()) {
                        console.log("Token expired.");
                        logout();
                    } else {
                        setUser(decodedToken); // Le token décodé contient les infos utilisateur (username, roles, id, etc.)
                        setIsAuthenticated(true);
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    }
                }
            } catch (error) {
                console.error("Error loading user from local storage:", error);
                logout();
            } finally {
                setIsLoading(false);
            }
        };
        loadUserFromLocalStorage();
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const response = await axios.post<{ accessToken: string }>(`${API_BASE_URL}/signin`, { username, password });
            const token = response.data.accessToken;
            localStorage.setItem('jwtToken', token);
            const decodedToken: DecodedUserToken = jwtDecode(token);
            setUser(decodedToken);
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return true; // Connexion réussie
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('jwtToken');
            throw error; // Propager l'erreur pour la gestion dans le composant de connexion
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
        // Rediriger vers la page de connexion après déconnexion
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;