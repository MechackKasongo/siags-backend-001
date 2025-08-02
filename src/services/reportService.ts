import api from './api';

// --- Interfaces pour les DTOs des Rapports ---
// D'après GDto.txt et DRepository.txt
export interface PatientGenderDistributionDTO {
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    count: number;
}

export interface AdmissionCountByDepartmentDTO {
    departmentName: string;
    admissionCount: number;
}

export interface MonthlyAdmissionCountDTO {
    month: number;
    count: number;
}

const BASE_URL = '/reports'; // Correspond à votre @RequestMapping /api/v1/reports

const ReportService = {
    // Rapports sur les patients
    getTotalPatientsCount: async (): Promise<number> => {
        const response = await api.get<number>(`${BASE_URL}/patients/count`);
        return response.data;
    },
    getPatientGenderDistribution: async (): Promise<PatientGenderDistributionDTO[]> => {
        const response = await api.get<PatientGenderDistributionDTO[]>(`${BASE_URL}/patients/gender-distribution`);
        return response.data;
    },

    // Rapports sur les admissions
    getTotalAdmissionsCount: async (): Promise<number> => {
        const response = await api.get<number>(`${BASE_URL}/admissions/count`);
        return response.data;
    },
    getAdmissionsCountBetweenDates: async (startDate: string, endDate: string): Promise<number> => {
        const response = await api.get<number>(`${BASE_URL}/admissions/count-between-dates`, {
            params: { startDate, endDate }
        });
        return response.data;
    },
    getAdmissionCountByDepartment: async (): Promise<AdmissionCountByDepartmentDTO[]> => {
        const response = await api.get<AdmissionCountByDepartmentDTO[]>(`${BASE_URL}/admissions/count-by-department`);
        return response.data;
    },
    getMonthlyAdmissionCount: async (year: number): Promise<MonthlyAdmissionCountDTO[]> => {
        const response = await api.get<MonthlyAdmissionCountDTO[]>(`${BASE_URL}/admissions/monthly-count-by-year?year=${year}`);
        return response.data;
    },

    // Ajoutez d'autres méthodes de rapport au fur et à mesure
};

export default ReportService;