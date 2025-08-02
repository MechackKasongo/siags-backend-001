import api from './api';
import { PaginatedResponse } from './patientService'; // Réutiliser l'interface de pagination

// --- Interfaces pour les DTOs des Utilisateurs ---
// D'après GDto.txt et AService.txt
export interface UserResponseDTO {
    id: number;
    username: string;
    email: string;
    nomComplet: string;
    roles: string[]; // Ex: ["ROLE_ADMIN", "ROLE_MEDECIN"]
}

export interface UserCreateRequest {
    username: string;
    email: string;
    password?: string; // Mot de passe obligatoire à la création, mais non pour la mise à jour si non modifié
    nomComplet: string;
    roles: string[]; // Ex: ["ROLE_ADMIN", "ROLE_RECEPTIONNISTE"]
}

export interface UserUpdateRequest {
    email?: string; // Optional for update
    password?: string; // Optional for update
    nomComplet?: string; // Optional for update
    roles?: string[]; // Optional for update
}

const BASE_URL_ADMIN = '/admin/users'; // Votre endpoint @RequestMapping("/api/admin/users")

const UserService = {
    // Créer un nouvel utilisateur (Admin seulement)
    createUser: async (userData: UserCreateRequest): Promise<UserResponseDTO> => {
        const response = await api.post<UserResponseDTO>(BASE_URL_ADMIN, userData);
        return response.data;
    },

    // Récupérer tous les utilisateurs avec pagination (Admin seulement)
    getAllUsersPaginated: async (
        page: number = 0,
        size: number = 10,
        sort: string = 'username,asc'
    ): Promise<PaginatedResponse<UserResponseDTO>> => {
        const response = await api.get<PaginatedResponse<UserResponseDTO>>(`${BASE_URL_ADMIN}?page=${page}&size=${size}&sort=${sort}`);
        return response.data;
    },

    // Récupérer un utilisateur par ID (Admin seulement)
    getUserById: async (id: number): Promise<UserResponseDTO> => {
        const response = await api.get<UserResponseDTO>(`${BASE_URL_ADMIN}/${id}`);
        return response.data;
    },

    // Mettre à jour un utilisateur (Admin seulement)
    updateUser: async (id: number, userData: UserUpdateRequest): Promise<UserResponseDTO> => {
        const response = await api.put<UserResponseDTO>(`${BASE_URL_ADMIN}/${id}`, userData);
        return response.data;
    },

    // Supprimer un utilisateur (Admin seulement)
    deleteUser: async (id: number): Promise<void> => {
        await api.delete(`${BASE_URL_ADMIN}/${id}`);
    },

    // Obtenir la liste de tous les rôles disponibles (utile pour les formulaires)
    // Supposons que vous avez un endpoint comme /api/roles ou /api/auth/roles
    getAllRoles: async (): Promise<string[]> => {
        const response = await api.get<string[]>('/auth/roles'); // Ajustez cet endpoint si différent
        return response.data;
    }
};

export default UserService;