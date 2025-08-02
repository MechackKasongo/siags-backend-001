import api from './api';
import type {PaginatedResponse} from './patientService';

// import PatientService from './patientService';

export interface DepartmentResponseDTO {
    id: number;
    name: string;
    description: string;
}

export interface PatientSummaryDTO { // DTO simplifié pour l'affichage dans l'admission
    id: number;
    firstName: string;
    lastName: string;
    recordNumber: string;
}

export interface AdmissionResponseDTO {
    id: number;
    admissionDate: string; // Ou Date, si converti
    reasonForAdmission: string;
    assignedDepartment: DepartmentResponseDTO; // Maintenant un objet Department
    roomNumber: string;
    bedNumber: string;
    status: 'ACTIVE' | 'DISCHARGED' | 'TRANSFERRED'; // Les statuts d'admission
    dischargeDate?: string; // Optionnel
    patient: PatientSummaryDTO; // Lien vers le patient
}

export interface AdmissionRequestDTO {
    patientId: number; // ID du patient lié
    admissionDate: string; // Format 'YYYY-MM-DDTHH:MM:SS' pour LocalDateTime
    reasonForAdmission: string;
    departmentId: number; // ID du département
    roomNumber: string;
    bedNumber: string;
    status: 'ACTIVE' | 'DISCHARGED' | 'TRANSFERRED'; // Lors de la création, ce sera souvent 'ACTIVE'
    dischargeDate?: string; // Optionnel, si l'admission est directement 'DISCHARGED'
}

const BASE_URL = '/admissions'; // Correspond à votre @RequestMapping /api/v1/admissions

const AdmissionService = {
    // Récupérer toutes les admissions avec pagination
    getAllAdmissionsPaginated: async (
        page: number = 0,
        size: number = 10,
        sort: string = 'admissionDate,desc'
    ): Promise<PaginatedResponse<AdmissionResponseDTO>> => {
        const response = await api.get<PaginatedResponse<AdmissionResponseDTO>>(`${BASE_URL}?page=${page}&size=${size}&sort=${sort}`);
        return response.data;
    },

    // Récupérer une admission par son ID
    getAdmissionById: async (id: number): Promise<AdmissionResponseDTO> => {
        const response = await api.get<AdmissionResponseDTO>(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Créer une nouvelle admission
    createAdmission: async (admissionData: AdmissionRequestDTO): Promise<AdmissionResponseDTO> => {
        const response = await api.post<AdmissionResponseDTO>(BASE_URL, admissionData);
        return response.data;
    },

    // Mettre à jour une admission existante
    updateAdmission: async (id: number, admissionData: AdmissionRequestDTO): Promise<AdmissionResponseDTO> => {
        const response = await api.put<AdmissionResponseDTO>(`${BASE_URL}/${id}`, admissionData);
        return response.data;
    },

    // Supprimer une admission
    deleteAdmission: async (id: number): Promise<void> => {
        await api.delete(`${BASE_URL}/${id}`);
    },

    // Récupérer les admissions par patient
    getAdmissionsByPatientId: async (patientId: number): Promise<AdmissionResponseDTO[]> => {
        const response = await api.get<AdmissionResponseDTO[]>(`${BASE_URL}/patient/${patientId}`);
        return response.data;
    },

    // Récupérer la liste des départements (nécessaire pour le formulaire d'admission)
    getAllDepartments: async (): Promise<DepartmentResponseDTO[]> => {
        // Supposons que vous avez un endpoint /departments
        const response = await api.get<DepartmentResponseDTO[]>('/departments');
        return response.data;
    },
};

export default AdmissionService;