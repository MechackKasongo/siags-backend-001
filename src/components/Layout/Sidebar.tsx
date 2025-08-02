import React, {useContext} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {AuthContext} from '../../contexts/AuthContext';

const sidebarStyle: React.CSSProperties = {
    width: '200px',
    backgroundColor: '#333',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
};

const ulStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
};

const liStyle: React.CSSProperties = {
    marginBottom: '15px',
};

const linkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.1em',
};

const Sidebar: React.FC = () => {
    const authContext = useContext(AuthContext);
    const location = useLocation();

    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const {user} = authContext;

    const isAdmin = user?.roles.includes('ROLE_ADMIN') ?? false;
    const isMedecin = user?.roles.includes('ROLE_MEDECIN') ?? false;

    const renderLink = (to: string, label: string) => (
        <Link
            to={to}
            style={linkStyle}
            aria-current={location.pathname === to ? 'page' : undefined}
        >
            {label}
        </Link>
    );

    return (
        <aside style={sidebarStyle}>
            <h2 style={{color: 'white', marginBottom: '30px'}}>Menu</h2>
            <nav aria-label="Menu principal">
                <ul style={ulStyle}>
                    <li style={liStyle}>{renderLink('/', 'Tableau de Bord')}</li>
                    <li style={liStyle}>{renderLink('/patients', 'Patients')}</li>
                    <li style={liStyle}>{renderLink('/admissions', 'Admissions')}</li>
                    {isAdmin && <li style={liStyle}>{renderLink('/users', 'Utilisateurs')}</li>}
                    {(isAdmin || isMedecin) && <li style={liStyle}>{renderLink('/reports', 'Rapports')}</li>}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;


// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../../contexts/AuthContext';
//
// const Sidebar: React.FC = () => {
//     const authContext = useContext(AuthContext);
//
//     if (authContext === undefined) {
//         throw new Error('AuthContext must be used within an AuthProvider');
//     }
//
//     const { user } = authContext;
//
//     const isAdmin = user?.roles.includes('ROLE_ADMIN');
//     const isMedecin = user?.roles.includes('ROLE_MEDECIN');
//
//     return (
//         <aside style={{
//             width: '200px',
//             backgroundColor: '#333',
//             color: 'white',
//             padding: '20px',
//             display: 'flex',
//             flexDirection: 'column',
//             boxShadow: '2px 0 5px rgba(0,0,0,0.2)'
//         }}>
//             <h2 style={{ color: 'white', marginBottom: '30px' }}>Menu</h2>
//             <nav>
//                 <ul style={{ listStyle: 'none', padding: 0 }}>
//                     <li style={{ marginBottom: '15px' }}>
//                         <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1em' }}>
//                             Tableau de Bord
//                         </Link>
//                     </li>
//                     <li style={{ marginBottom: '15px' }}>
//                         <Link to="/patients" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1em' }}>
//                             Patients
//                         </Link>
//                     </li>
//                     <li style={{ marginBottom: '15px' }}>
//                         <Link to="/admissions" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1em' }}>
//                             Admissions
//                         </Link>
//                     </li>
//                     {isAdmin && ( // Visible uniquement par les ADMINS
//                         <li style={{ marginBottom: '15px' }}>
//                             <Link to="/users" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1em' }}>
//                                 Utilisateurs
//                             </Link>
//                         </li>
//                     )}
//                     {(isAdmin || isMedecin) && ( // Visible par les ADMINS et MEDECINS
//                         <li style={{ marginBottom: '15px' }}>
//                             <Link to="/reports" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1em' }}>
//                                 Rapports
//                             </Link>
//                         </li>
//                     )}
//                 </ul>
//             </nav>
//         </aside>
//     );
// };
//
// export default Sidebar;