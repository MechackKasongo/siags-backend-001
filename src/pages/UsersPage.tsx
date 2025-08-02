import React, {useContext, useEffect, useState} from 'react';
import UserService, {PaginatedResponse, UserResponseDTO} from '../services/userService';
import UserForm from '../components/UserForm';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Paper,
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
import {AuthContext} from '../contexts/AuthContext';
import {useNavigate} from 'react-router-dom';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<UserResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<UserResponseDTO | null>(null);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalElements, setTotalElements] = useState<number>(0);

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const isAdmin = authContext?.user?.roles.includes('ROLE_ADMIN');

    const fetchUsers = async (currentPage: number, pageSize: number) => {
        setLoading(true);
        setError(null);
        try {
            const response: PaginatedResponse<UserResponseDTO> = await UserService.getAllUsersPaginated(currentPage, pageSize);
            setUsers(response.content);
            setTotalElements(response.totalElements);
        } catch (err) {
            console.error("Erreur lors de la récupération des utilisateurs:", err);
            setError("Impossible de charger les utilisateurs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAdmin) {
            navigate('/unauthorized');
            return;
        }
        fetchUsers(page, rowsPerPage);
    }, [page, rowsPerPage, isAdmin, navigate]);

    const handleAddUser = () => {
        setEditingUser(null);
        setOpenForm(true);
    };

    const handleEditUser = (user: UserResponseDTO) => {
        setEditingUser(user);
        setOpenForm(true);
    };

    const handleDeleteUser = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            try {
                setLoading(true);
                await UserService.deleteUser(id);
                alert("Utilisateur supprimé avec succès !");
                // Après suppression, recharge la page courante.
                // Si suppression de dernier élément de page, tu peux éventuellement remonter d'une page.
                const newPage = (users.length === 1 && page > 0) ? page - 1 : page;
                setPage(newPage); // ceci déclenchera useEffect et reload
            } catch (err) {
                console.error("Erreur lors de la suppression de l'utilisateur:", err);
                setError("Impossible de supprimer l'utilisateur.");
                setLoading(false);
            }
        }
    };

    const handleFormSubmit = () => {
        setOpenForm(false);
        setEditingUser(null);
        fetchUsers(page, rowsPerPage);
    };

    const handleFormClose = () => {
        setOpenForm(false);
        setEditingUser(null);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (!isAdmin) {
        return <Typography color="error" sx={{p: 3}}>Accès non autorisé. Seuls les administrateurs peuvent gérer les
            utilisateurs.</Typography>;
    }

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Chargement des utilisateurs...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{p: 3}}>
                <Typography color="error" gutterBottom>Erreur: {error}</Typography>
                <Button variant="contained" onClick={() => fetchUsers(page, rowsPerPage)}>Réessayer</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h2">Gestion des Utilisateurs</Typography>
                <Button variant="contained" startIcon={<AddIcon/>} onClick={handleAddUser}>
                    Ajouter Utilisateur
                </Button>
            </Box>

            {users.length === 0 ? (
                <Typography>Aucun utilisateur trouvé.</Typography>
            ) : (
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nom d'utilisateur</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Nom Complet</TableCell>
                                    <TableCell>Rôles</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.nomComplet}</TableCell>
                                        <TableCell>{user.roles.map(role => role.replace('ROLE_', '')).join(', ')}</TableCell>
                                        <TableCell>
                                            <Button
                                                startIcon={<EditIcon />}
                                                onClick={() => handleEditUser(user)}
                                                size="small"
                                                sx={{ mr: 1 }}
                                            >
                                                Modifier
                                            </Button>
                                            <Button
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteUser(user.id)}
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

            <Dialog open={openForm} onClose={handleFormClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingUser ? 'Modifier l\'Utilisateur' : 'Ajouter un Nouvel Utilisateur'}</DialogTitle>
                <DialogContent>
                    <UserForm
                        user={editingUser}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormClose}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default UsersPage;


// import React, { useEffect, useState, useContext } from 'react';
// import UserService, { UserResponseDTO, PaginatedResponse } from '../services/userService';
// import UserForm from '../components/UserForm';
// import {
//     Button, CircularProgress, Box, Typography, Table, TableBody, TableCell,
//     TableContainer, TableHead, TableRow, Paper, TablePagination, Dialog, DialogTitle, DialogContent
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { AuthContext } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
//
// const UsersPage: React.FC = () => {
//     const [users, setUsers] = useState<UserResponseDTO[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [openForm, setOpenForm] = useState<boolean>(false);
//     const [editingUser, setEditingUser] = useState<UserResponseDTO | null>(null);
//     const [page, setPage] = useState<number>(0);
//     const [rowsPerPage, setRowsPerPage] = useState<number>(10);
//     const [totalElements, setTotalElements] = useState<number>(0);
//
//     const authContext = useContext(AuthContext);
//     const navigate = useNavigate();
//
//     // Vérification de rôle (ADMIN seulement)
//     const isAdmin = authContext?.user?.roles.includes('ROLE_ADMIN');
//
//     useEffect(() => {
//         if (!isAdmin) {
//             navigate('/unauthorized'); // Rediriger si pas ADMIN
//             return;
//         }
//         const fetchUsers = async (currentPage: number, pageSize: number) => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const response: PaginatedResponse<UserResponseDTO> = await UserService.getAllUsersPaginated(currentPage, pageSize);
//                 setUsers(response.content);
//                 setTotalElements(response.totalElements);
//             } catch (err) {
//                 console.error("Erreur lors de la récupération des utilisateurs:", err);
//                 setError("Impossible de charger les utilisateurs.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchUsers(page, rowsPerPage);
//     }, [page, rowsPerPage, isAdmin, navigate]); // Dépendance à isAdmin et navigate
//
//     const handleAddUser = () => {
//         setEditingUser(null);
//         setOpenForm(true);
//     };
//
//     const handleEditUser = (user: UserResponseDTO) => {
//         setEditingUser(user);
//         setOpenForm(true);
//     };
//
//     const handleDeleteUser = async (id: number) => {
//         if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
//             try {
//                 setLoading(true);
//                 await UserService.deleteUser(id);
//                 alert("Utilisateur supprimé avec succès !");
//                 fetchUsers(page, rowsPerPage); // Recharger les utilisateurs
//             } catch (err) {
//                 console.error("Erreur lors de la suppression de l'utilisateur:", err);
//                 setError("Impossible de supprimer l'utilisateur.");
//                 setLoading(false);
//             }
//         }
//     };
//
//     const handleFormSubmit = () => {
//         setOpenForm(false);
//         setEditingUser(null);
//         fetchUsers(page, rowsPerPage); // Recharger les utilisateurs après succès
//     };
//
//     const handleFormClose = () => {
//         setOpenForm(false);
//         setEditingUser(null);
//     };
//
//     const handleChangePage = (event: unknown, newPage: number) => {
//         setPage(newPage);
//     };
//
//     const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0); // Retour à la première page lors du changement de taille
//     };
//
//     if (!isAdmin) {
//         return <Typography color="error">Accès non autorisé. Seuls les administrateurs peuvent gérer les utilisateurs.</Typography>;
//     }
//
//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
//                 <CircularProgress />
//                 <Typography variant="h6" sx={{ ml: 2 }}>Chargement des utilisateurs...</Typography>
//             </Box>
//         );
//     }
//
//     if (error) {
//         return <Typography color="error">Erreur: {error}</Typography>;
//     }
//
//     return (
//         <Box sx={{ p: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                 <Typography variant="h4" component="h2">Gestion des Utilisateurs</Typography>
//                 <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={handleAddUser}
//                 >
//                     Ajouter Utilisateur
//                 </Button>
//             </Box>
//
//             {users.length === 0 && <Typography>Aucun utilisateur trouvé.</Typography>}
//
//             {users.length > 0 && (
//                 <Paper>
//                     <TableContainer>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell>ID</TableCell>
//                                     <TableCell>Nom d'utilisateur</TableCell>
//                                     <TableCell>Email</TableCell>
//                                     <TableCell>Nom Complet</TableCell>
//                                     <TableCell>Rôles</TableCell>
//                                     <TableCell>Actions</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {users.map((user) => (
//                                     <TableRow key={user.id}>
//                                         <TableCell>{user.id}</TableCell>
//                                         <TableCell>{user.username}</TableCell>
//                                         <TableCell>{user.email}</TableCell>
//                                         <TableCell>{user.nomComplet}</TableCell>
//                                         <TableCell>{user.roles.map(role => role.replace('ROLE_', '')).join(', ')}</TableCell>
//                                         <TableCell>
//                                             <Button
//                                                 startIcon={<EditIcon />}
//                                                 onClick={() => handleEditUser(user)}
//                                                 size="small"
//                                                 sx={{ mr: 1 }}
//                                             >
//                                                 Modifier
//                                             </Button>
//                                             <Button
//                                                 startIcon={<DeleteIcon />}
//                                                 onClick={() => handleDeleteUser(user.id)}
//                                                 size="small"
//                                                 color="error"
//                                             >
//                                                 Supprimer
//                                             </Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                     <TablePagination
//                         rowsPerPageOptions={[5, 10, 25]}
//                         component="div"
//                         count={totalElements}
//                         rowsPerPage={rowsPerPage}
//                         page={page}
//                         onPageChange={handleChangePage}
//                         onRowsPerPageChange={handleChangeRowsPerPage}
//                         labelRowsPerPage="Lignes par page :"
//                     />
//                 </Paper>
//             )}
//
//             <Dialog open={openForm} onClose={handleFormClose} maxWidth="sm" fullWidth>
//                 <DialogTitle>{editingUser ? 'Modifier l\'Utilisateur' : 'Ajouter un Nouvel Utilisateur'}</DialogTitle>
//                 <DialogContent>
//                     <UserForm
//                         user={editingUser}
//                         onSubmit={handleFormSubmit}
//                         onCancel={handleFormClose}
//                     />
//                 </DialogContent>
//             </Dialog>
//         </Box>
//     );
// };
//
// export default UsersPage;