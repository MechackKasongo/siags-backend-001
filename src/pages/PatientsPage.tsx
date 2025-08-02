import React, {useCallback, useEffect, useState} from 'react';
import type {PaginatedResponse, PatientResponseDTO} from '../services/patientService';
import PatientService from '../services/patientService';
import PatientForm from '../components/PatientForm';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';

const PatientsPage: React.FC = () => {
    const [patients, setPatients] = useState<PatientResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingPatient, setEditingPatient] = useState<PatientResponseDTO | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const pageSize: number = 10;

    const fetchPatients = useCallback(async (page: number = 0, query: string = '') => {
        setLoading(true);
        setError(null);
        try {
            if (query.trim()) {
                // Rechercher sans pagination (adapter selon backend)
                const results = await PatientService.searchPatients(query.trim());
                setPatients(results);
                setTotalPages(1);
                setCurrentPage(0);
            } else {
                const response: PaginatedResponse<PatientResponseDTO> = await PatientService.getAllPatients(page, pageSize);
                setPatients(response.content);
                setTotalPages(response.totalPages);
                setCurrentPage(response.number);
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des patients:", err);
            setError("Impossible de charger les patients.");
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    useEffect(() => {
        fetchPatients(currentPage, searchQuery);
    }, [fetchPatients, currentPage, searchQuery]);

    const handleAddPatient = () => {
        setEditingPatient(null);
        setShowForm(true);
    };

    const handleEditPatient = (patient: PatientResponseDTO) => {
        setEditingPatient(patient);
        setShowForm(true);
    };

    const handleDeletePatient = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
            try {
                setLoading(true);
                await PatientService.deletePatient(id);
                alert("Patient supprimé avec succès !");
                // Recharge la page actuelle, en s'assurant que si on est sur la dernière page avec un seul élément, on remonte d'une page
                if (patients.length === 1 && currentPage > 0) {
                    setCurrentPage(currentPage - 1);
                } else {
                    fetchPatients(currentPage, searchQuery);
                }
            } catch (err) {
                console.error("Erreur lors de la suppression du patient:", err);
                setError("Impossible de supprimer le patient.");
                setLoading(false);
            }
        }
    };

    const handleFormSubmit = () => {
        setShowForm(false);
        setEditingPatient(null);
        fetchPatients(currentPage, searchQuery);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingPatient(null);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0);
    };

    if (loading) return (
        <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
            <CircularProgress/>
        </Box>
    );
    if (error) return <Typography color="error" sx={{mt: 4}}>{error}</Typography>;

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h4" gutterBottom>Gestion des Patients</Typography>

            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Box component="form" onSubmit={e => e.preventDefault()} sx={{display: 'flex', gap: 1}}>
                    <TextField
                        placeholder="Rechercher par nom/prénom..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        size="small"
                    />
                    <Button variant="contained" onClick={() => fetchPatients(0, searchQuery)}>Rechercher</Button>
                </Box>

                <Button variant="contained" color="success" onClick={handleAddPatient}>
                    Ajouter Patient
                </Button>
            </Box>

            {patients.length === 0 ? (
                <Typography>Aucun patient trouvé.</Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="patients table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>N° Dossier</TableCell>
                                    <TableCell>Nom Complet</TableCell>
                                    <TableCell>Date de Naissance</TableCell>
                                    <TableCell>Genre</TableCell>
                                    <TableCell>Contact</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {patients.map(patient => (
                                    <TableRow key={patient.id}>
                                        <TableCell>{patient.recordNumber}</TableCell>
                                        <TableCell>{patient.lastName} {patient.firstName}</TableCell>
                                        <TableCell>{patient.dateOfBirth}</TableCell>
                                        <TableCell>{patient.gender}</TableCell>
                                        <TableCell>{patient.contactNumber}</TableCell>
                                        <TableCell>
                                            <Button size="small" onClick={() => handleEditPatient(patient)}
                                                    sx={{mr: 1}}>Modifier</Button>
                                            <Button size="small" color="error"
                                                    onClick={() => handleDeletePatient(patient.id)}>Supprimer</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {!searchQuery && totalPages > 1 && (
                        <Box sx={{mt: 2, textAlign: 'center'}}>
                            <Button
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                sx={{mr: 1}}
                            >
                                Précédent
                            </Button>
                            <Typography component="span" sx={{mx: 1}}>
                                Page {currentPage + 1} sur {totalPages}
                            </Typography>
                            <Button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage === totalPages - 1}
                                sx={{ml: 1}}
                            >
                                Suivant
                            </Button>
                        </Box>
                    )}
                </>
            )}

            {showForm && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1300,
                    }}
                >
                    <Box sx={{bgcolor: 'background.paper', p: 3, borderRadius: 2, maxWidth: 600, width: '90%'}}>
                        <PatientForm
                            patient={editingPatient}
                            onSubmit={handleFormSubmit}
                            onCancel={handleFormCancel}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default PatientsPage;
