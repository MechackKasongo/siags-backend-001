import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            <Sidebar />
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <main style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f9f9f9' }}>
                    <Outlet /> {/* Ici seront rendues les pages spécifiques (Dashboard, Patients, etc.) */}
                </main>
                {/* Vous pouvez ajouter un Footer ici si vous en avez un */}
            </div>
        </div>
    );
};

export default MainLayout;