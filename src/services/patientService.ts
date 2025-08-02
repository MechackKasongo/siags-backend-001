import api from './api';

const BASE_URL = '/patients';

// --- Interfaces pour les DTOs des Patients ---
interface PatientResponseDTO {
    id: number;
    recordNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    contactNumber: string;
    address: string;
}

interface PatientRequestDTO {
    recordNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    contactNumber: string;
    address: string;
}

interface PaginatedResponse<T> {
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

// --- Services pour les Patients ---
const PatientService = {
    getAllPatients: async (
        page: number = 0,
        size: number = 10,
        sort: string = 'lastName,asc'
    ): Promise<PaginatedResponse<PatientResponseDTO>> => {
        const response = await api.get<PaginatedResponse<PatientResponseDTO>>(
            `${BASE_URL}?page=${page}&size=${size}&sort=${sort}`
        );
        return response.data;
    },

    getPatientById: async (id: number): Promise<PatientResponseDTO> => {
        const response = await api.get<PatientResponseDTO>(`${BASE_URL}/${id}`);
        return response.data;
    },

    createPatient: async (patientData: PatientRequestDTO): Promise<PatientResponseDTO> => {
        const response = await api.post<PatientResponseDTO>(BASE_URL, patientData);
        return response.data;
    },

    updatePatient: async (id: number, patientData: PatientRequestDTO): Promise<PatientResponseDTO> => {
        const response = await api.put<PatientResponseDTO>(`${BASE_URL}/${id}`, patientData);
        return response.data;
    },

    deletePatient: async (id: number): Promise<void> => {
        await api.delete(`${BASE_URL}/${id}`);
    },

    searchPatients: async (query: string): Promise<PatientResponseDTO[]> => {
        const response = await api.get<PatientResponseDTO[]>(`${BASE_URL}/search?query=${query}`);
        return response.data;
    }
};

// Exports propres (aucun conflit)
export {PatientService as default, PatientService};
export type {PatientResponseDTO, PatientRequestDTO, PaginatedResponse};
