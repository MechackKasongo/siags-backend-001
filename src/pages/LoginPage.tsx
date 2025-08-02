import React, {useContext, useState} from 'react';
import {AuthContext} from '../contexts/AuthContext';
import {useNavigate} from 'react-router-dom';
import {Alert, Box, Button, TextField, Typography} from '@mui/material';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { login } = authContext;
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Échec de la connexion. Veuillez vérifier votre nom d\'utilisateur et votre mot de passe.');
            console.error("Login error:", err);
        }
    };

    return (
        <Box
            maxWidth={400}
            mx="auto"
            mt={8}
            p={4}
            boxShadow={3}
            borderRadius={2}
            bgcolor="background.paper"
        >
            <Typography variant="h4" component="h1" mb={3} textAlign="center">
                Connexion
            </Typography>
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Nom d'utilisateur"
                    variant="outlined"
                    fullWidth
                    required
                    margin="normal"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <TextField
                    label="Mot de passe"
                    variant="outlined"
                    type="password"
                    fullWidth
                    required
                    margin="normal"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{mt: 3}}
                >
                    Se connecter
                </Button>
            </form>
        </Box>
    );
};

export default LoginPage;
