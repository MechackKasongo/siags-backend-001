import React, { useEffect, useState } from 'react';
// Vous pourrez importer vos services de rapport ici plus tard
// import reportService from '../services/reportService';

const DashboardPage: React.FC = () => {
    const [totalPatients, setTotalPatients] = useState<number | null>(null);
    const [admissionsToday, setAdmissionsToday] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Exemple d'appel à un service (vous devrez créer reportService.ts)
                // const patientsCount = await reportService.getTotalPatientsCount();
                // setTotalPatients(patientsCount);

                // const todayAdmissions = await reportService.getAdmissionsCountToday();
                // setAdmissionsToday(todayAdmissions);

                // Pour l'instant, des données mockées
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

    if (loading) return <p>Chargement du tableau de bord...</p>;
    if (error) return <p style={{ color: 'red' }}>Erreur: {error}</p>;

    return (
        <div>
            <h2>Tableau de Bord</h2>
            <p>Bienvenue sur le système intégré d'admission et de gestion des patients (SIAGS).</p>

            <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1, backgroundColor: 'white' }}>
                    <h3>Patients Totaux</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{totalPatients}</p>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1, backgroundColor: 'white' }}>
                    <h3>Admissions Aujourd'hui</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{admissionsToday}</p>
                </div>
                {/* Ajoutez d'autres widgets ici */}
            </div>

            {/* Vous pouvez ajouter des graphiques, des listes d'événements récents, etc. */}
        </div>
    );
};

export default DashboardPage;