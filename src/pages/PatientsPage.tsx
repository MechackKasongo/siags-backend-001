import React, { useEffect, useState } from 'react';
import PatientService, { PatientResponseDTO, PaginatedResponse } from '../services/patientService';
import PatientForm from '../components/PatientForm'; // Pour le formulaire d'ajout/modification

const PatientsPage: React.FC = () => {
    const [patients, setPatients] = useState<PatientResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingPatient, setEditingPatient] = useState<PatientResponseDTO | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const pageSize: number = 10; // Définissez votre taille de page

    const fetchPatients = async (page: number = 0) => {
        setLoading(true);
        setError(null);
        try {
            let response: PaginatedResponse<PatientResponseDTO> | PatientResponseDTO[];

            if (searchQuery) {
                // Si une recherche est active, nous n'utilisons pas la pagination normale du service
                // Vous pouvez ajuster cela si votre API de recherche supporte la pagination
                response = await PatientService.searchPatients(searchQuery);
                setPatients(response as PatientResponseDTO[]);
                setTotalPages(1); // Pour la recherche, on peut considérer qu'il y a une seule "page" de résultats
            } else {
                response = await PatientService.getAllPatients(page, pageSize);
                setPatients(response.content);
                setTotalPages(response.totalPages);
                setCurrentPage(response.number);
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des patients:", err);
            setError("Impossible de charger les patients.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients(currentPage);
    }, [currentPage, searchQuery]); // Recharger si la page ou la recherche change

    const handleAddPatient = () => {
        setEditingPatient(null); // Pas de patient en édition
        setShowForm(true);
    };

    const handleEditPatient = (patient: PatientResponseDTO) => {
        setEditingPatient(patient);
        setShowForm(true);
    };

    const handleDeletePatient = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
            try {
                setLoading(true);
                await PatientService.deletePatient(id);
                fetchPatients(currentPage); // Recharger les patients après suppression
                alert("Patient supprimé avec succès !");
            } catch (err) {
                console.error("Erreur lors de la suppression du patient:", err);
                setError("Impossible de supprimer le patient.");
                setLoading(false);
            }
        }
    };

    const handleFormSubmit = () => {
        setShowForm(false);
        setEditingPatient(null);
        fetchPatients(currentPage); // Recharger les patients après ajout/modification
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingPatient(null);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        // Optionnel: Déclencher la recherche après un délai (debounce) pour éviter trop de requêtes
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(0); // Réinitialiser à la première page pour la recherche
        fetchPatients(0);
    };


    if (loading) return <p>Chargement des patients...</p>;
    if (error) return <p style={{ color: 'red' }}>Erreur: {error}</p>;

    return (
        <div>
            <h2>Gestion des Patients</h2>

            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Rechercher par nom/prénom..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{ padding: '8px', marginRight: '10px', width: '300px' }}
                    />
                    <button type="submit" style={{ padding: '8px 12px', cursor: 'pointer' }}>Rechercher</button>
                </form>
                <button onClick={handleAddPatient} style={{ padding: '10px 15px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Ajouter Patient
                </button>
            </div>

            {showForm && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%' }}>
                        <PatientForm
                            patient={editingPatient}
                            onSubmit={handleFormSubmit}
                            onCancel={handleFormCancel}
                        />
                    </div>
                </div>
            )}

            {patients.length === 0 && <p>Aucun patient trouvé.</p>}

            {patients.length > 0 && (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#e0e0e0' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>N° Dossier</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Nom Complet</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Date de Naissance</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Genre</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Contact</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{patient.recordNumber}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{patient.lastName} {patient.firstName}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{patient.dateOfBirth}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{patient.gender}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{patient.contactNumber}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    <button onClick={() => handleEditPatient(patient)} style={{ marginRight: '10px', padding: '6px 10px', cursor: 'pointer' }}>Modifier</button>
                                    <button onClick={() => handleDeletePatient(patient.id)} style={{ padding: '6px 10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {!searchQuery && totalPages > 1 && (
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                style={{ padding: '8px 12px', marginRight: '10px', cursor: 'pointer' }}
                            >
                                Précédent
                            </button>
                            <span>Page {currentPage + 1} sur {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage === totalPages - 1}
                                style={{ padding: '8px 12px', marginLeft: '10px', cursor: 'pointer' }}
                            >
                                Suivant
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PatientsPage;