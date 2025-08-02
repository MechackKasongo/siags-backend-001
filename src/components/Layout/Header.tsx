import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    if (authContext === undefined) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { user, logout } = authContext;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            borderBottom: '1px solid #ddd'
        }}>
            <h1>SIAGS - Gestion Hospitalière</h1>
            <nav>
                {user ? (
                    <span style={{ marginRight: '15px' }}>
            Bienvenue, {user.nomComplet || user.username} ({user.roles.join(', ')})
          </span>
                ) : (
                    <span>Chargement...</span>
                )}
                <button onClick={handleLogout} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                    Déconnexion
                </button>
            </nav>
        </header>
    );
};

export default Header;