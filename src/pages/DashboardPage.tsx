import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Paper, Typography} from '@mui/material';

const DashboardPage: React.FC = () => {
    const [totalPatients, setTotalPatients] = useState<number | null>(null);
    const [admissionsToday, setAdmissionsToday] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Simuler l'appel API
                setTimeout(() => {
                    setTotalPatients(1250);
                    setAdmissionsToday(15);
                    setLoading(false);
                }, 1000);

            } catch (err) {
                console.error("Erreur lors du chargement du tableau de bord:", err);
                setError("Impossible de charger les données du tableau de bord.");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
                <Typography variant="h6" sx={{ml: 2}}>Chargement du tableau de bord...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h4" gutterBottom>Tableau de Bord</Typography>
            <Typography>Bienvenue sur le système intégré d'admission et de gestion des patients (SIAGS).</Typography>

            <Box sx={{display: 'flex', gap: 3, mt: 4}}>
                <Paper sx={{p: 3, flex: 1, textAlign: 'center'}}>
                    <Typography variant="h6" gutterBottom>Patients Totaux</Typography>
                    <Typography variant="h3" fontWeight="bold">{totalPatients}</Typography>
                </Paper>

                <Paper sx={{p: 3, flex: 1, textAlign: 'center'}}>
                    <Typography variant="h6" gutterBottom>Admissions Aujourd'hui</Typography>
                    <Typography variant="h3" fontWeight="bold">{admissionsToday}</Typography>
                </Paper>

                {/* Ajoutez d'autres widgets ici */}
            </Box>
        </Box>
    );
};

export default DashboardPage;
