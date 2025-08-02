// Exemple simplifié de App.tsx avec MainLayout
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
// ... autres imports de pages
import PatientsPage from './pages/PatientsPage.tsx';
import AdmissionsPage from './pages/AdmissionsPage.tsx';
import UsersPage from './pages/UsersPage.tsx';
import ReportsPage from './pages/ReportsPage.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import MainLayout from './components/Layout/MainLayout.tsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                {/* Les routes protégées utilisent le MainLayout */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<MainLayout />}> {/* La route principale rend le layout */}
                        <Route index element={<DashboardPage />} /> {/* Page par défaut du layout */}
                        <Route path="patients" element={<PatientsPage />} />
                        <Route path="admissions" element={<AdmissionsPage />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path="reports" element={<ReportsPage />} />
                    </Route>
                </Route>
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </Router>
    );
}

export default App;

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // Importez vos composants de page au fur et à mesure que vous les créez
// import LoginPage from './pages/LoginPage.tsx';
// import DashboardPage from './pages/DashboardPage.tsx';
// import PatientsPage from './pages/PatientsPage.tsx';
// import AdmissionsPage from './pages/AdmissionsPage.tsx';
// import UsersPage from './pages/UsersPage.tsx'; // Pour l'administration des utilisateurs
// import ReportsPage from './pages/ReportsPage.tsx';
// import PrivateRoute from './components/PrivateRoute.tsx'; // Composant pour les routes protégées
//
// function App() {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/login" element={<LoginPage />} />
//                 {/* Routes protégées qui nécessitent une authentification */}
//                 <Route element={<PrivateRoute />}>
//                     <Route path="/" element={<DashboardPage />} />
//                     <Route path="/patients" element={<PatientsPage />} />
//                     <Route path="/admissions" element={<AdmissionsPage />} />
//                     <Route path="/users" element={<UsersPage />} /> {/* Accessible uniquement aux ADMINS */}
//                     <Route path="/reports" element={<ReportsPage />} /> {/* Accessible aux ADMINS et MEDECINS */}
//                 </Route>
//                 {/* Route 404 Not Found (optionnel) */}
//                 <Route path="*" element={<div>404 Not Found</div>} />
//             </Routes>
//         </Router>
//     );
// }
//
// export default App;

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
//
// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }
//
// export default App
