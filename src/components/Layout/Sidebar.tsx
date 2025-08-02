import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (authContext === undefined) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { user } = authContext;

    const isAdmin = user?.roles.includes('ROLE_ADMIN');
    const isMedecin = user?.roles.includes('ROLE_MEDECIN');

    return (
        <aside style={{
            width: '200px',
            backgroundColor: '#333',
            color: 'white',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '2px 0 5px rgba(0,0,0,0.2)'
        }}>
            <h2 style={{ color: 'white', marginBottom: '30px' }}>Menu</h2>
            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '15px' }}>
                        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1em' }}>
                            Tableau de Bord
                        </Link>
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                        <Link to="/patients" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1em' }}>
                            Patients
                        </Link>
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                        <Link to="/admissions" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1em' }}>
                            Admissions
                        </Link>
                    </li>
                    {isAdmin && ( // Visible uniquement par les ADMINS
                        <li style={{ marginBottom: '15px' }}>
                            <Link to="/users" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1em' }}>
                                Utilisateurs
                            </Link>
                        </li>
                    )}
                    {(isAdmin || isMedecin) && ( // Visible par les ADMINS et MEDECINS
                        <li style={{ marginBottom: '15px' }}>
                            <Link to="/reports" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1em' }}>
                                Rapports
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;