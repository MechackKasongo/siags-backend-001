import api from './api';

// --- Interfaces pour les DTOs des Patients ---
// Ces interfaces DOIVENT correspondre à la structure de vos DTOs Spring Boot (PatientResponseDTO, PatientRequestDTO)

export interface PatientResponseDTO {
    id: number;
    recordNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // Ou Date, si vous convertissez en objet Date côté frontend
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    contactNumber: string;
    address: string;
    // Ajoutez d'autres champs de votre PatientResponseDTO si nécessaire
}

export interface PatientRequestDTO {
    recordNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // Format 'YYYY-MM-DD'
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    contactNumber: string;
    address: string;
    // Ajoutez d'autres champs de votre PatientRequestDTO si nécessaire
}

// Interface pour la réponse paginée
export interface PaginatedResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}


const BASE_URL = '/patients'; // Correspond à votre @RequestMapping /api/v1/patients dans le backend

const PatientService = {
    // Récupérer tous les patients avec pagination et tri
    getAllPatients: async (page: number = 0, size: number = 10, sort: string = 'lastName,asc'): Promise<PaginatedResponse<PatientResponseDTO>> => {
        const response = await api.get<PaginatedResponse<PatientResponseDTO>>(`${BASE_URL}?page=${page}&size=${size}&sort=${sort}`);
        return response.data;
    },

    // Récupérer un patient par son ID
    getPatientById: async (id: number): Promise<PatientResponseDTO> => {
        const response = await api.get<PatientResponseDTO>(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Créer un nouveau patient
    createPatient: async (patientData: PatientRequestDTO): Promise<PatientResponseDTO> => {
        const response = await api.post<PatientResponseDTO>(BASE_URL, patientData);
        return response.data;
    },

    // Mettre à jour un patient existant
    updatePatient: async (id: number, patientData: PatientRequestDTO): Promise<PatientResponseDTO> => {
        const response = await api.put<PatientResponseDTO>(`${BASE_URL}/${id}`, patientData);
        return response.data;
    },

    // Supprimer un patient
    deletePatient: async (id: number): Promise<void> => {
        await api.delete(`${BASE_URL}/${id}`);
    },

    // Rechercher des patients par nom ou prénom
    searchPatients: async (query: string): Promise<PatientResponseDTO[]> => {
        const response = await api.get<PatientResponseDTO[]>(`${BASE_URL}/search?query=${query}`);
        return response.data;
    }
};

export default PatientService;