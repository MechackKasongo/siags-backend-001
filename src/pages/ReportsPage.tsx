import React, { useEffect, useState, useContext } from 'react';
import ReportService, {
    PatientGenderDistributionDTO, AdmissionCountByDepartmentDTO, MonthlyAdmissionCountDTO
} from '../services/reportService';
import {
    Box, Typography, CircularProgress, Paper, Grid, Card, CardContent
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2'; // Pour les graphiques
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ReportsPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [totalPatients, setTotalPatients] = useState<number | null>(null);
    const [genderDistribution, setGenderDistribution] = useState<PatientGenderDistributionDTO[]>([]);
    const [admissionByDepartment, setAdmissionByDepartment] = useState<AdmissionCountByDepartmentDTO[]>([]);
    const [monthlyAdmissions, setMonthlyAdmissions] = useState<MonthlyAdmissionCountDTO[]>([]);
    const currentYear = new Date().getFullYear();

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    // Vérification de rôle (ADMIN ou MEDECIN)
    const isAuthorized = authContext?.user?.roles.includes('ROLE_ADMIN') || authContext?.user?.roles.includes('ROLE_MEDECIN');

    useEffect(() => {
        if (!isAuthorized) {
            navigate('/unauthorized'); // Rediriger si non autorisé
            return;
        }
        const fetchReports = async () => {
            setLoading(true);
            setError(null);
            try {
                const patientsCount = await ReportService.getTotalPatientsCount();
                setTotalPatients(patientsCount);

                const genderDist = await ReportService.getPatientGenderDistribution();
                setGenderDistribution(genderDist);

                const deptAdmissions = await ReportService.getAdmissionCountByDepartment();
                setAdmissionByDepartment(deptAdmissions);

                const monthlyAdm = await ReportService.getMonthlyAdmissionCount(currentYear);
                setMonthlyAdmissions(monthlyAdm);

            } catch (err) {
                console.error("Erreur lors du chargement des rapports:", err);
                setError("Impossible de charger les données des rapports.");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [isAuthorized, navigate, currentYear]);

    // Données pour le graphique de distribution par genre
    const genderChartData = {
        labels: genderDistribution.map(d => d.gender),
        datasets: [{
            data: genderDistribution.map(d => d.count),
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'], // Bleu, Rose, Jaune
            hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        }],
    };

    // Données pour le graphique des admissions par département
    const deptChartData = {
        labels: admissionByDepartment.map(d => d.departmentName),
        datasets: [{
            label: 'Nombre d\'Admissions',
            data: admissionByDepartment.map(d => d.admissionCount),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    // Données pour le graphique des admissions mensuelles
    const monthlyChartData = {
        labels: Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('fr', { month: 'long' })), // Noms des mois
        datasets: [{
            label: `Admissions en ${currentYear}`,
            data: Array.from({ length: 12 }, (_, i) => monthlyAdmissions.find(m => m.month === i + 1)?.count || 0),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
        }],
    };

    if (!isAuthorized) {
        return <Typography color="error">Accès non autorisé. Seuls les administrateurs et médecins peuvent accéder aux rapports.</Typography>;
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Chargement des rapports...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">Erreur: {error}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>Tableau de Bord des Rapports</Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">Total Patients</Typography>
                            <Typography variant="h3" color="primary">{totalPatients}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">Total Admissions</Typography>
                            <Typography variant="h3" color="primary">{null /* TODO: get total admissions count */}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Ajoutez d'autres cartes de KPI si besoin */}

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Distribution des Patients par Genre</Typography>
                        <Pie data={genderChartData} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Admissions par Département</Typography>
                        <Bar data={deptChartData} />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Admissions Mensuelles ({currentYear})</Typography>
                        <Bar data={monthlyChartData} />
                    </Paper>
                </Grid>
                {/* Ajoutez d'autres graphiques ou tableaux de rapports ici */}
            </Grid>
        </Box>
    );
};

export default ReportsPage;