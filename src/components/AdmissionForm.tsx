import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import type {AdmissionRequestDTO, AdmissionResponseDTO, DepartmentResponseDTO} from '../services/admissionService';
import AdmissionService from '../services/admissionService';
import type {PatientResponseDTO} from '../services/patientService'; // Pour rechercher les patients
import Autocomplete from '@mui/material/Autocomplete';
import api from '../services/api'; // Pour l'appel de recherche de patients
// import { PatientResponseDTO, PaginatedResponse } from '../services/patientService';


interface AdmissionFormProps {
    admission?: AdmissionResponseDTO | null;
    onSubmit: () => void;
    onCancel: () => void;
}

const AdmissionForm: React.FC<AdmissionFormProps> = ({ admission, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<AdmissionRequestDTO>({
        patientId: admission?.patient.id || 0,
        admissionDate: admission?.admissionDate || new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM
        reasonForAdmission: admission?.reasonForAdmission || '',
        departmentId: admission?.assignedDepartment.id || 0,
        roomNumber: admission?.roomNumber || '',
        bedNumber: admission?.bedNumber || '',
        status: admission?.status || 'ACTIVE',
        dischargeDate: admission?.dischargeDate || undefined,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [departments, setDepartments] = useState<DepartmentResponseDTO[]>([]);
    const [patientsOptions, setPatientsOptions] = useState<PatientResponseDTO[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientResponseDTO | null>(admission?.patient || null);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await AdmissionService.getAllDepartments();
                setDepartments(data);
            } catch (err) {
                console.error("Failed to fetch departments:", err);
                setError("Impossible de charger les départements.");
            }
        };
        fetchDepartments();

        if (admission) {
            setFormData({
                patientId: admission.patient.id,
                admissionDate: admission.admissionDate.slice(0, 16),
                reasonForAdmission: admission.reasonForAdmission,
                departmentId: admission.assignedDepartment.id,
                roomNumber: admission.roomNumber,
                bedNumber: admission.bedNumber,
                status: admission.status,
                dischargeDate: admission.dischargeDate?.slice(0, 16) || undefined,
            });
            setSelectedPatient(admission.patient);
        } else {
            setFormData({
                patientId: 0,
                admissionDate: new Date().toISOString().slice(0, 16),
                reasonForAdmission: '',
                departmentId: 0,
                roomNumber: '',
                bedNumber: '',
                status: 'ACTIVE',
                dischargeDate: undefined,
            });
            setSelectedPatient(null);
        }
    }, [admission]);

    const handlePatientSearch = async (event: React.SyntheticEvent, value: string) => {
        if (value.length < 2) {
            setPatientsOptions([]);
            return;
        }
        try {
            const response = await api.get<PatientResponseDTO[]>(`/patients/search?query=${value}`);
            setPatientsOptions(response.data);
        } catch (err) {
            console.error("Failed to search patients:", err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name as string]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!selectedPatient) {
            setError("Veuillez sélectionner un patient.");
            setLoading(false);
            return;
        }
        if (formData.departmentId === 0) {
            setError("Veuillez sélectionner un département.");
            setLoading(false);
            return;
        }

        const dataToSubmit = { ...formData, patientId: selectedPatient.id };

        try {
            if (admission) {
                await AdmissionService.updateAdmission(admission.id, dataToSubmit);
                alert("Admission mise à jour avec succès !");
            } else {
                await AdmissionService.createAdmission(dataToSubmit);
                alert("Admission ajoutée avec succès !");
            }
            onSubmit();
        } catch (err: any) {
            console.error("Erreur lors de la soumission du formulaire d'admission:", err);
            setError(err.response?.data?.message || "Erreur lors de l'enregistrement de l'admission.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <h3>{admission ? 'Modifier l\'Admission' : 'Ajouter une Nouvelle Admission'}</h3>

            <Autocomplete
                options={patientsOptions}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.recordNumber})`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedPatient}
                onChange={(event: React.SyntheticEvent, newValue: PatientResponseDTO | null) => {
                    setSelectedPatient(newValue);
                    setFormData(prev => ({...prev, patientId: newValue?.id || 0}));
                }}
                onInputChange={handlePatientSearch}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Rechercher et sélectionner un patient"
                        variant="outlined"
                        required
                        error={!selectedPatient && !!error}
                        helperText={!selectedPatient && !!error ? "Veuillez sélectionner un patient" : ""}
                    />
                )}
            />

            <TextField
                label="Date d'Admission"
                type="datetime-local"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                label="Motif d'Admission"
                name="reasonForAdmission"
                value={formData.reasonForAdmission}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                required
            />
            <FormControl fullWidth required>
                <InputLabel>Département Assigné</InputLabel>
                <Select
                    name="departmentId"
                    value={formData.departmentId}
                    label="Département Assigné"
                    onChange={handleSelectChange}
                >
                    <MenuItem value={0} disabled>Sélectionner un département</MenuItem>
                    {departments.map(dept => (
                        <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Numéro de Chambre"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Numéro de Lit"
                name="bedNumber"
                value={formData.bedNumber}
                onChange={handleChange}
                fullWidth
                required
            />
            <FormControl fullWidth required>
                <InputLabel>Statut</InputLabel>
                <Select
                    name="status"
                    value={formData.status}
                    label="Statut"
                    onChange={handleSelectChange}
                >
                    <MenuItem value="ACTIVE">Actif</MenuItem>
                    <MenuItem value="DISCHARGED">Sorti</MenuItem>
                    <MenuItem value="TRANSFERRED">Transféré</MenuItem>
                </Select>
            </FormControl>
            {formData.status === 'DISCHARGED' && (
                <TextField
                    label="Date de Sortie"
                    type="datetime-local"
                    name="dischargeDate"
                    value={formData.dischargeDate || ''}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={onCancel} disabled={loading} variant="outlined">
                    Annuler
                </Button>
                <Button type="submit" disabled={loading} variant="contained">
                    {loading ? <CircularProgress size={24} /> : (admission ? 'Modifier' : 'Ajouter')}
                </Button>
            </Box>
        </Box>
    );
};

export default AdmissionForm;
