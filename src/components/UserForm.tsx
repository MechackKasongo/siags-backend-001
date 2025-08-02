import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Checkbox, FormControlLabel, FormGroup, FormControl,
    InputLabel, Select, MenuItem, CircularProgress, Box, Typography
} from '@mui/material';
import UserService, { UserCreateRequest, UserResponseDTO, UserUpdateRequest } from '../services/userService';

interface UserFormProps {
    user?: UserResponseDTO | null; // Utilisateur à éditer (null pour ajout)
    onSubmit: () => void;
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<UserCreateRequest | UserUpdateRequest>({
        username: '',
        email: '',
        password: '',
        nomComplet: '',
        roles: [],
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [allRoles, setAllRoles] = useState<string[]>([]); // Tous les rôles disponibles

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const roles = await UserService.getAllRoles();
                setAllRoles(roles);
            } catch (err) {
                console.error("Failed to fetch roles:", err);
                setError("Impossible de charger les rôles disponibles.");
            }
        };
        fetchRoles();

        if (user) {
            setFormData({
                email: user.email,
                nomComplet: user.nomComplet,
                roles: user.roles,
                // Pas de username ni de password pour UserUpdateRequest s'ils ne sont pas modifiés
                // Si vous voulez pouvoir changer le username, il faudra l'ajouter au UserUpdateRequest DTO
            });
        } else {
            setFormData({
                username: '',
                email: '',
                password: '',
                nomComplet: '',
                roles: [],
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (roleName: string) => {
        setFormData((prev) => {
            const currentRoles = (prev.roles || []) as string[]; // Assurer que c'est un tableau de strings
            if (currentRoles.includes(roleName)) {
                return { ...prev, roles: currentRoles.filter((r) => r !== roleName) };
            } else {
                return { ...prev, roles: [...currentRoles, roleName] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (user) {
                // Mode modification
                await UserService.updateUser(user.id, formData as UserUpdateRequest);
                alert("Utilisateur mis à jour avec succès !");
            } else {
                // Mode création
                // Pour la création, assurez-vous que username et password sont présents
                if (!('username' in formData) || !formData.username || !formData.password) {
                    setError("Nom d'utilisateur et mot de passe sont obligatoires pour la création.");
                    setLoading(false);
                    return;
                }
                await UserService.createUser(formData as UserCreateRequest);
                alert("Utilisateur créé avec succès !");
            }
            onSubmit();
        } catch (err: any) {
            console.error("Erreur lors de la soumission du formulaire utilisateur:", err);
            setError(err.response?.data?.message || "Erreur lors de l'enregistrement de l'utilisateur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5">{user ? 'Modifier l\'Utilisateur' : 'Ajouter un Nouvel Utilisateur'}</Typography>

            {!user && ( // Champ username uniquement pour la création
                <TextField
                    label="Nom d'utilisateur"
                    name="username"
                    value={(formData as UserCreateRequest).username || ''}
                    onChange={handleChange}
                    fullWidth
                    required={!user}
                />
            )}
            <TextField
                label="Nom Complet"
                name="nomComplet"
                value={formData.nomComplet || ''}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Mot de passe"
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleChange}
                fullWidth
                required={!user} // Mot de passe requis à la création, optionnel à la modification
                helperText={user ? "Laisser vide pour ne pas changer le mot de passe" : ""}
            />

            <FormControl component="fieldset" variant="standard" required error={formData.roles?.length === 0 && !!error}>
                <Typography variant="subtitle1" component="legend">Rôles:</Typography>
                <FormGroup row>
                    {allRoles.map((role) => (
                        <FormControlLabel
                            key={role}
                            control={
                                <Checkbox
                                    checked={(formData.roles || []).includes(role)}
                                    onChange={() => handleRoleChange(role)}
                                    name={role}
                                />
                            }
                            label={role.replace('ROLE_', '')} // Afficher ADMIN, MEDECIN, etc.
                        />
                    ))}
                </FormGroup>
                {formData.roles?.length === 0 && !!error && <Typography color="error" variant="caption">Veuillez sélectionner au moins un rôle.</Typography>}
            </FormControl>

            {error && <Typography color="error">{error}</Typography>}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button onClick={onCancel} disabled={loading} variant="outlined">
                    Annuler
                </Button>
                <Button type="submit" disabled={loading} variant="contained">
                    {loading ? <CircularProgress size={24} /> : (user ? 'Modifier' : 'Ajouter')}
                </Button>
            </Box>
        </Box>
    );
};

export default UserForm;