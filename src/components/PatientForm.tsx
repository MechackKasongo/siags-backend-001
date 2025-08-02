import React, {useEffect, useState} from 'react';
import type {PatientRequestDTO, PatientResponseDTO} from '../services/patientService';
import PatientService from '../services/patientService';

interface PatientFormProps {
    patient?: PatientResponseDTO | null; // Patient à éditer (null pour ajout)
    onSubmit: () => void; // Fonction à appeler après soumission réussie
    onCancel: () => void; // Fonction à appeler si l'utilisateur annule
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<PatientRequestDTO>({
        recordNumber: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'MALE',
        contactNumber: '',
        address: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (patient) {
            setFormData({
                recordNumber: patient.recordNumber,
                firstName: patient.firstName,
                lastName: patient.lastName,
                dateOfBirth: patient.dateOfBirth,
                gender: patient.gender,
                contactNumber: patient.contactNumber,
                address: patient.address,
            });
        } else {
            setFormData({
                recordNumber: '',
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: 'MALE',
                contactNumber: '',
                address: '',
            });
        }
    }, [patient]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (patient) {
                await PatientService.updatePatient(patient.id, formData);
                alert("Patient mis à jour avec succès !");
            } else {
                await PatientService.createPatient(formData);
                alert("Patient ajouté avec succès !");
            }
            onSubmit();
        } catch (err) {
            console.error("Erreur lors de la soumission du formulaire patient:", err);
            setError("Erreur lors de l'enregistrement du patient. Vérifiez les données.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>{patient ? 'Modifier le Patient' : 'Ajouter un Nouveau Patient'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="recordNumber">N° Dossier:</label>
                    <input
                        type="text"
                        id="recordNumber"
                        name="recordNumber"
                        value={formData.recordNumber}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div>
                    <label htmlFor="firstName">Prénom:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div>
                    <label htmlFor="lastName">Nom:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div>
                    <label htmlFor="dateOfBirth">Date de Naissance:</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div>
                    <label htmlFor="gender">Genre:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="MALE">Masculin</option>
                        <option value="FEMALE">Féminin</option>
                        <option value="OTHER">Autre</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="contactNumber">N° Téléphone:</label>
                    <input
                        type="text"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div>
                    <label htmlFor="address">Adresse:</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows={3}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button type="button" onClick={onCancel} disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Annuler
                    </button>
                    <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        {loading ? 'Enregistrement...' : (patient ? 'Modifier' : 'Ajouter')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientForm;
