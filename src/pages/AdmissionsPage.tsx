import React, {useEffect, useState} from 'react';
import AdmissionService, {AdmissionResponseDTO, PaginatedResponse} from '../services/admissionService';
import AdmissionForm from '../components/AdmissionForm';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdmissionsPage: React.FC = () => {
    const [admissions, setAdmissions] = useState<AdmissionResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [editingAdmission, setEditingAdmission] = useState<AdmissionResponseDTO | null>(null);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [snackbar, setSnackbar] = useState<{
        open: boolean,
        message: string,
        severity: 'success' | 'error'
    }>({open: false, message: '', severity: 'success'});

    const fetchAdmissions = async (currentPage: number, pageSize: number) => {
        setLoading(true);
        setError(null);
        try {
            const response: PaginatedResponse<AdmissionResponseDTO> = await AdmissionService.getAllAdmissionsPaginated(currentPage, pageSize);
            setAdmissions(response.content);
            setTotalElements(response.totalElements);
        } catch (err) {
            console.error("Erreur lors de la récupération des admissions:", err);
            setError("Impossible de charger les admissions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmissions(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const handleAddAdmission = () => {
        setEditingAdmission(null);
        setOpenForm(true);
    };

    const handleEditAdmission = (admission: AdmissionResponseDTO) => {
        setEditingAdmission(admission);
        setOpenForm(true);
    };

    const handleDeleteAdmission = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette admission ?")) {
            try {
                setLoading(true);
                await AdmissionService.deleteAdmission(id);
                setSnackbar({open: true, message: "Admission supprimée avec succès !", severity: 'success'});
                fetchAdmissions(page, rowsPerPage);
            } catch (err) {
                console.error("Erreur lors de la suppression de l'admission:", err);
                setSnackbar({open: true, message: "Impossible de supprimer l'admission.", severity: 'error'});
                setLoading(false);
            }
        }
    };

    const handleFormSubmit = () => {
        setOpenForm(false);
        setEditingAdmission(null);
        fetchAdmissions(page, rowsPerPage);
    };

    const handleFormClose = () => {
        setOpenForm(false);
        setEditingAdmission(null);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({...prev, open: false}));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Chargement des admissions...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">Erreur: {error}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h2">Gestion des Admissions</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddAdmission}
                    disabled={loading}
                >
                    Ajouter Admission
                </Button>
            </Box>

            {admissions.length === 0 ? (
                <Typography>Aucune admission trouvée.</Typography>
            ) : (
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Patient</TableCell>
                                    <TableCell>Date d'Admission</TableCell>
                                    <TableCell>Motif</TableCell>
                                    <TableCell>Département</TableCell>
                                    <TableCell>Chambre/Lit</TableCell>
                                    <TableCell>Statut</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {admissions.map((admission) => (
                                    <TableRow key={admission.id}>
                                        <TableCell>{admission.id}</TableCell>
                                        <TableCell>{admission.patient.firstName} {admission.patient.lastName} ({admission.patient.recordNumber})</TableCell>
                                        <TableCell>{new Date(admission.admissionDate).toLocaleString()}</TableCell>
                                        <TableCell>{admission.reasonForAdmission}</TableCell>
                                        <TableCell>{admission.assignedDepartment?.name || 'N/A'}</TableCell>
                                        <TableCell>{admission.roomNumber}/{admission.bedNumber}</TableCell>
                                        <TableCell>{admission.status.charAt(0) + admission.status.slice(1).toLowerCase()}</TableCell>
                                        <TableCell>
                                            <Button
                                                startIcon={<EditIcon />}
                                                onClick={() => handleEditAdmission(admission)}
                                                size="small"
                                                sx={{ mr: 1 }}
                                            >
                                                Modifier
                                            </Button>
                                            <Button
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteAdmission(admission.id)}
                                                size="small"
                                                color="error"
                                            >
                                                Supprimer
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalElements}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Lignes par page :"
                    />
                </Paper>
            )}

            <Dialog open={openForm} onClose={handleFormClose} maxWidth="md" fullWidth>
                <DialogTitle>{editingAdmission ? 'Modifier l\'Admission' : 'Ajouter une Nouvelle Admission'}</DialogTitle>
                <DialogContent>
                    <AdmissionForm
                        admission={editingAdmission}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormClose}
                    />
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{width: '100%'}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdmissionsPage;
