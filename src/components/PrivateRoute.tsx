import React, {useContext} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {AuthContext} from '../contexts/AuthContext';

interface PrivateRouteProps {
    allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('PrivateRoute must be used within an AuthProvider');
    }

    const { user, isAuthenticated, isLoading } = authContext;

    if (isLoading) {
        return <div>Chargement de l’authentification...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user) {
        const hasRole = allowedRoles.some(role => user.roles.includes(role));
        if (!hasRole) {
            return <Navigate to="/unauthorized" replace/>;
        }
    }

    return <Outlet />;
};

export default PrivateRoute;
