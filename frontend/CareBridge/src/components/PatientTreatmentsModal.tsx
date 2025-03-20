import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/PatientReportModals.css";
import '../../styles/Responsive.css';

// Define interfaces for the data structures
interface DiagnosticTemplate {
  id: number;
  name: string;
  description: string;
}

interface PatientDiagnostic {
  id: number;
  diagnosticTemplateId: number;
  patientId: number;
  doctorId: number;
  doctorName?: string;
  dateDiagnosed: string;
  notes: string;
  // The template details will be populated when viewing
  template?: DiagnosticTemplate;
  treatments?: Treatment[];
}

interface Treatment {
  id: number;
  name: string;
  description: string;
  patientDiagnosticId: number;
  startDate: string;
  endDate?: string;
}

// Define props for the component
interface PatientTreatmentsModalProps {
  patientId: number;
  patientName: string;
  token: string;
  onClose: () => void;
}

const PatientTreatmentsModal: React.FC<PatientTreatmentsModalProps> = ({
  patientId,
  patientName,
  token,
  onClose
}) => {
  // State for diagnostics with treatments
  const [diagnostics, setDiagnostics] = useState<PatientDiagnostic[]>([]);
  // State for loading status
  const [loading, setLoading] = useState<boolean>(true);
  // State for error messages
  const [error, setError] = useState<string | null>(null);
  // State for expanded diagnostic (to show treatments)
  const [expandedDiagnosticId, setExpandedDiagnosticId] = useState<number | null>(null);
  // State for templates (to display names)
  const [templates, setTemplates] = useState<Record<number, DiagnosticTemplate>>({});

  // Fetch diagnostics when component mounts
  useEffect(() => {
    fetchDiagnostics();
    fetchTemplates();
  }, [patientId]);

  // Function to fetch diagnostic templates
  const fetchTemplates = async () => {
    try {
      const response = await fetch("http://localhost:5156/api/diagnostictemplates", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching templates:", errorText);
        return;
      }

      const data = await response.json();
      const templatesMap: Record<number, DiagnosticTemplate> = {};
      data.forEach((template: DiagnosticTemplate) => {
        templatesMap[template.id] = template;
      });
      setTemplates(templatesMap);
    } catch (err) {
      console.error("Error fetching templates:", err);
    }
  };

  // Function to fetch patient diagnostics and treatments
  const fetchDiagnostics = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch diagnostics for the patient
      const response = await fetch(`http://localhost:5156/api/patients/${patientId}/diagnostics`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to fetch diagnostics (Status: ${response.status})`);
      }

      const data = await response.json();
      console.log("Diagnostics data received:", data);
      
      // For each diagnostic, fetch treatments
      const diagnosticsWithTreatments = await Promise.all(
        data.map(async (diagnostic: PatientDiagnostic) => {
          try {
            const treatmentsResponse = await fetch(`http://localhost:5156/api/treatments/diagnostic/${diagnostic.id}`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            });

            if (treatmentsResponse.ok) {
              const treatmentsData = await treatmentsResponse.json();
              return { ...diagnostic, treatments: treatmentsData };
            }
            
            return diagnostic;
          } catch (error) {
            console.error(`Error fetching treatments for diagnostic ${diagnostic.id}:`, error);
            return diagnostic;
          }
        })
      );

      // Filter to only include diagnostics that have treatments
      const diagnosticsWithTreatmentsOnly = diagnosticsWithTreatments.filter(
        (diagnostic) => diagnostic.treatments && diagnostic.treatments.length > 0
      );

      setDiagnostics(diagnosticsWithTreatmentsOnly);
    } catch (err) {
      console.error("Error fetching diagnostics:", err);
      setError(`Failed to load treatment history: ${err instanceof Error ? err.message : 'Unknown error'}`);
      toast.error("Failed to load treatment history");
    } finally {
      setLoading(false);
    }
  };

  // Function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "Not specified";
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to toggle expanded diagnostic
  const toggleDiagnostic = (diagnosticId: number) => {
    if (expandedDiagnosticId === diagnosticId) {
      setExpandedDiagnosticId(null);
    } else {
      setExpandedDiagnosticId(diagnosticId);
    }
  };

  // Get template name for a diagnostic
  const getTemplateName = (templateId: number): string => {
    return templates[templateId]?.name || `Condition #${templateId}`;
  };

  return (
    <div className="modal-backdrop">
      <div className="patient-report-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Treatment History for {patientName}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <ToastContainer />
          
          {/* Loading State */}
          {loading && (
            <div className="modal-loading">
              <p>Loading treatment history...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="modal-error">
              <p>{error}</p>
              <button onClick={fetchDiagnostics} className="retry-button">
                Try Again
              </button>
            </div>
          )}

          {/* No Treatments State */}
          {!loading && !error && diagnostics.length === 0 && (
            <div className="no-data-message">
              <p>No treatment history found. Your doctor will add treatments to your record when they are prescribed.</p>
            </div>
          )}

          {/* Treatments List */}
          {!loading && !error && diagnostics.length > 0 && (
            <div className="report-list">
              {diagnostics.map((diagnostic) => (
                <div key={diagnostic.id} className="report-card">
                  <div 
                    className="report-header"
                    onClick={() => toggleDiagnostic(diagnostic.id)}
                  >
                    <div className="report-header-content">
                      <h3>{getTemplateName(diagnostic.diagnosticTemplateId)}</h3>
                      <p>Diagnosed on {formatDate(diagnostic.dateDiagnosed)}</p>
                    </div>
                    <span className="expand-arrow">
                      {expandedDiagnosticId === diagnostic.id ? "▲" : "▼"}
                    </span>
                  </div>

                  {diagnostic.notes && (
                    <div className="report-summary" onClick={() => toggleDiagnostic(diagnostic.id)}>
                      <p className="diagnostic-notes">{diagnostic.notes}</p>
                    </div>
                  )}

                  {/* Expanded Treatments List */}
                  {expandedDiagnosticId === diagnostic.id && (
                    <div className="treatments-container">
                      <h4>Prescribed Treatments</h4>
                      
                      {!diagnostic.treatments || diagnostic.treatments.length === 0 ? (
                        <p className="no-data-message">No treatments have been prescribed for this diagnosis.</p>
                      ) : (
                        <ul className="treatments-list">
                          {diagnostic.treatments.map((treatment) => (
                            <li key={treatment.id} className="treatment-item">
                              <div className="treatment-details">
                                <h5>{treatment.name}</h5>
                                <p className="treatment-description">{treatment.description}</p>
                                <div className="treatment-dates">
                                  <p><strong>Start Date:</strong> {formatDate(treatment.startDate)}</p>
                                  {treatment.endDate && 
                                    <p><strong>End Date:</strong> {formatDate(treatment.endDate)}</p>
                                  }
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientTreatmentsModal;