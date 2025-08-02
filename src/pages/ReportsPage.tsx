import React, {useContext, useEffect, useState} from 'react';
import ReportService, {
    AdmissionCountByDepartmentDTO,
    MonthlyAdmissionCountDTO,
    PatientGenderDistributionDTO
} from '../services/reportService';
import {Box, Button, Card, CardContent, CircularProgress, Grid, Paper, Typography} from '@mui/material';
import {AuthContext} from '../contexts/AuthContext';
import {useNavigate} from 'react-router-dom';
import {Bar, Pie} from 'react-chartjs-2';
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ReportsPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [totalPatients, setTotalPatients] = useState<number | null>(null);
    const [totalAdmissions, setTotalAdmissions] = useState<number | null>(null);
    const [genderDistribution, setGenderDistribution] = useState<PatientGenderDistributionDTO[]>([]);
    const [admissionByDepartment, setAdmissionByDepartment] = useState<AdmissionCountByDepartmentDTO[]>([]);
    const [monthlyAdmissions, setMonthlyAdmissions] = useState<MonthlyAdmissionCountDTO[]>([]);
    const currentYear = new Date().getFullYear();

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const isAuthorized = authContext?.user?.roles.includes('ROLE_ADMIN') || authContext?.user?.roles.includes('ROLE_MEDECIN');

    useEffect(() => {
        if (!isAuthorized) {
            navigate('/unauthorized');
            return;
        }
        const fetchReports = async () => {
            setLoading(true);
            setError(null);
            try {
                const [patientsCount, admissionsCount, genderDist, deptAdmissions, monthlyAdm] = await Promise.all([
                    ReportService.getTotalPatientsCount(),
                    ReportService.getTotalAdmissionsCount(),
                    ReportService.getPatientGenderDistribution(),
                    ReportService.getAdmissionCountByDepartment(),
                    ReportService.getMonthlyAdmissionCount(currentYear),
                ]);

                setTotalPatients(patientsCount);
                setTotalAdmissions(admissionsCount);
                setGenderDistribution(genderDist);
                setAdmissionByDepartment(deptAdmissions);
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

    const genderChartData = {
        labels: genderDistribution.map(d => d.gender),
        datasets: [{
            data: genderDistribution.map(d => d.count),
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        }],
    };

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

    const monthlyChartData = {
        labels: Array.from({length: 12}, (_, i) => new Date(0, i).toLocaleString('fr', {month: 'long'})),
        datasets: [{
            label: `Admissions en ${currentYear}`,
            data: Array.from({ length: 12 }, (_, i) => monthlyAdmissions.find(m => m.month === i + 1)?.count || 0),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
        }],
    };

    if (!isAuthorized) return null;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Chargement des rapports...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{textAlign: 'center', mt: 4}}>
                <Typography color="error" gutterBottom>Erreur: {error}</Typography>
                <Button variant="contained" onClick={() => window.location.reload()}>Recharger</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>Tableau de Bord des Rapports</Typography>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Patients</Typography>
                            <Typography variant="h3" color="primary">{totalPatients}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Admissions</Typography>
                            <Typography variant="h3" color="primary">{totalAdmissions}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Distribution des Patients par Genre</Typography>
                        {genderDistribution.length === 0 ? (
                            <Typography>Aucune donnée de distribution par genre disponible.</Typography>
                        ) : (
                            <Pie data={genderChartData} aria-label="Distribution des patients par genre"/>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Admissions par Département</Typography>
                        {admissionByDepartment.length === 0 ? (
                            <Typography>Aucune donnée disponible.</Typography>
                        ) : (
                            <Bar data={deptChartData} aria-label="Admissions par département"/>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Admissions Mensuelles ({currentYear})</Typography>
                        {monthlyAdmissions.length === 0 ? (
                            <Typography>Aucune donnée disponible.</Typography>
                        ) : (
                            <Bar data={monthlyChartData}
                                 aria-label={`Admissions mensuelles pour l'année ${currentYear}`}/>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReportsPage;
