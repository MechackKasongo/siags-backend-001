import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.tsx'; // Nous allons créer ceci

interface PrivateRouteProps {
    allowedRoles?: string[]; // Optionnel: pour spécifier les rôles autorisés
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const authContext = useContext(AuthContext);

    if (authContext === undefined) {
        throw new Error('PrivateRoute must be used within an AuthProvider');
    }

    const { user, isAuthenticated, isLoading } = authContext;

    if (isLoading) {
        return <div>Loading authentication...</div>; // Ou un spinner de chargement
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Optionnel: Gérer les rôles si la route nécessite des rôles spécifiques
    if (allowedRoles && user && !allowedRoles.some(role => user.roles.includes(role))) {
        return <Navigate to="/unauthorized" replace />; // Redirige vers une page "Accès non autorisé"
    }

    return <Outlet />;
};

export default PrivateRoute;