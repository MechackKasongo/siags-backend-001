import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => { // Utilisez React.FC pour typer les composants fonctionnels
    const [username, setUsername] = useState<string>(''); // Type string
    const [password, setPassword] = useState<string>(''); // Type string
    const [error, setError] = useState<string>('');
    const authContext = useContext(AuthContext); // Le contexte peut être undefined s'il n'est pas fourni

    // Vérifiez si le contexte est défini avant de l'utiliser
    if (authContext === undefined) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { login } = authContext;
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => { // Type pour l'événement de formulaire
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/'); // Redirige vers le tableau de bord après connexion réussie
        } catch (err) {
            setError('Échec de la connexion. Veuillez vérifier votre nom d\'utilisateur et votre mot de passe.');
            console.error("Login error:", err);
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Nom d'utilisateur:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} // Type pour l'événement de changement
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Mot de passe:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default LoginPage;