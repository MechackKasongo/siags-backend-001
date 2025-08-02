import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
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
                {/* Routes protégées */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<MainLayout/>}>
                        <Route index element={<DashboardPage/>}/>
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
