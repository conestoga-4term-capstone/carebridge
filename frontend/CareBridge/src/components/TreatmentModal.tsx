import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/HealthRecordsModal.css";
import "../../styles/TreatmentsModal.css";
import DiagnosticTemplatesModal from "./DiagnosticTemplatesModal";
import '../../styles/Responsive.css';

// Interface for diagnostic template
interface DiagnosticTemplate {
  id: number;
  name: string;
  description: string;
  createdByDoctorId: number;
  createdByDoctorName: string;
}

// Interface for patient diagnostic
interface PatientDiagnostic {
  id: number;
  diagnosticTemplateId: number;
  dateDiagnosed: string;
  notes: string;
}

// Interface for treatment form data
interface TreatmentFormData {
  name: string;
  description: string;
  patientDiagnosticId: number | null;
  startDate: string;
  endDate: string;
}

// Interface for diagnostic form data
interface DiagnosticFormData {
  diagnosticTemplateId: number | null;
  patientId: number;
  dateDiagnosed: string;
  notes: string;
}

// Props interface
interface TreatmentModalProps {
  appointmentId: number;
  patientId: number;
  patientName: string;
  token: string;
  onClose: () => void;
  onTreatmentAdded?: () => void;
}

const TreatmentModal: React.FC<TreatmentModalProps> = ({
  appointmentId,
  patientId,
  patientName,
  token,
  onClose,
  onTreatmentAdded
}) => {
  // State for loading indicator
  const [loading, setLoading] = useState<boolean>(false);
  // State for templates
  const [templates, setTemplates] = useState<DiagnosticTemplate[]>([]);
  // State for patient's existing diagnostics
  const [diagnostics, setDiagnostics] = useState<PatientDiagnostic[]>([]);
  // State to toggle between using existing or new diagnostic
  const [useExistingDiagnostic, setUseExistingDiagnostic] = useState<boolean>(true);
  // State for selected diagnostic
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState<number | null>(null);
  // State for diagnostic form
  const [diagnosticForm, setDiagnosticForm] = useState<DiagnosticFormData>({
    diagnosticTemplateId: null,
    patientId: patientId,
    dateDiagnosed: new Date().toISOString().split('T')[0],
    notes: ""
  });
  // State for treatment form
  const [treatmentForm, setTreatmentForm] = useState<TreatmentFormData>({
    name: "",
    description: "",
    patientDiagnosticId: null,
    startDate: new Date().toISOString().split('T')[0],
    endDate: ""
  });
  // State for showing templates modal
  const [showTemplatesModal, setShowTemplatesModal] = useState<boolean>(false);

  // Fetch templates and diagnostics on component mount
  useEffect(() => {
    fetchTemplates();
    fetchPatientDiagnostics();
  }, [patientId]);

  // Fetch diagnostic templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5156/api/diagnostictemplates", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch templates (Status: ${response.status})`);
      }

      const data = await response.json();
      setTemplates(data);

      // Set default template if available
      if (data.length > 0) {
        setDiagnosticForm(prev => ({ ...prev, diagnosticTemplateId: data[0].id }));
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load diagnostic templates");
    } finally {
      setLoading(false);
    }
  };

  // Fetch patient's diagnostics
  const fetchPatientDiagnostics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5156/api/patients/${patientId}/diagnostics`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch patient diagnostics (Status: ${response.status})`);
      }

      const data = await response.json();
      setDiagnostics(data);

      // Set default selected diagnostic if available
      if (data.length > 0) {
        setSelectedDiagnosticId(data[0].id);
        setTreatmentForm(prev => ({ ...prev, patientDiagnosticId: data[0].id }));
      } else {
        // If no existing diagnostics, default to creating a new one
        setUseExistingDiagnostic(false);
      }
    } catch (error) {
      console.error("Error fetching patient diagnostics:", error);
      toast.error("Failed to load patient diagnostics");
    } finally {
      setLoading(false);
    }
  };

  // Handle diagnostic form change
  const handleDiagnosticFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDiagnosticForm(prev => ({ ...prev, [name]: name === "diagnosticTemplateId" ? Number(value) : value }));
  };

  // Handle treatment form change
  const handleTreatmentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTreatmentForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle diagnostic selection change
  const handleDiagnosticSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setSelectedDiagnosticId(selectedId);
    setTreatmentForm(prev => ({ ...prev, patientDiagnosticId: selectedId }));
  };

  // Handle toggle between existing and new diagnostic
  const handleToggleUseExisting = () => {
    setUseExistingDiagnostic(!useExistingDiagnostic);
  };

  // Handle template selection from the templates modal
  const handleTemplateSelected = (template: DiagnosticTemplate) => {
    setDiagnosticForm(prev => ({ ...prev, diagnosticTemplateId: template.id }));
    toast.info(`Template "${template.name}" selected`);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let diagnosticId = selectedDiagnosticId;

      // If creating a new diagnostic, do that first
      if (!useExistingDiagnostic || diagnostics.length === 0) {
        if (!diagnosticForm.diagnosticTemplateId) {
          toast.error("Please select a diagnostic template");
          setLoading(false);
          return;
        }

        const diagnosticResponse = await fetch("http://localhost:5156/api/diagnostics", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(diagnosticForm)
        });

        if (!diagnosticResponse.ok) {
          const errorText = await diagnosticResponse.text();
          throw new Error(errorText || `Failed to create diagnostic (Status: ${diagnosticResponse.status})`);
        }

        const diagnosticResult = await diagnosticResponse.json();
        diagnosticId = diagnosticResult.diagnosticId;
        toast.success("Diagnostic created successfully");
      }

      // Now create the treatment
      const treatmentData = {
        ...treatmentForm,
        patientDiagnosticId: diagnosticId
      };

      const treatmentResponse = await fetch("http://localhost:5156/api/treatments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(treatmentData)
      });

      if (!treatmentResponse.ok) {
        const errorText = await treatmentResponse.text();
        throw new Error(errorText || `Failed to create treatment (Status: ${treatmentResponse.status})`);
      }

      toast.success("Treatment added successfully");
      
      if (onTreatmentAdded) {
        onTreatmentAdded();
      }
      
      // Close modal after short delay to allow toast to be seen
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error adding treatment:", error);
      toast.error(`Failed to add treatment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Get template name by ID
  const getTemplateName = (templateId: number): string => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : `Template #${templateId}`;
  };

  return (
    <div className="modal-backdrop">
      <div className="treatment-modal">
        <div className="modal-header">
          <h2>Add Treatment for {patientName}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <ToastContainer />

          {loading && <div className="modal-loading">Loading...</div>}

          <form onSubmit={handleSubmit}>
            <div className="section-title">
              <h3>Diagnostic Information</h3>
            </div>

            {/* Diagnostic Selection */}
            {diagnostics.length > 0 && (
              <div className="toggle-container">
                <div className="toggle-option">
                  <input 
                    type="radio" 
                    id="existing-diagnostic" 
                    name="diagnostic-option" 
                    checked={useExistingDiagnostic} 
                    onChange={handleToggleUseExisting}
                  />
                  <label htmlFor="existing-diagnostic">Use Existing Diagnostic</label>
                </div>
                <div className="toggle-option">
                  <input 
                    type="radio" 
                    id="new-diagnostic" 
                    name="diagnostic-option" 
                    checked={!useExistingDiagnostic} 
                    onChange={handleToggleUseExisting}
                  />
                  <label htmlFor="new-diagnostic">Create New Diagnostic</label>
                </div>
              </div>
            )}

            {/* Existing Diagnostic Selection */}
            {useExistingDiagnostic && diagnostics.length > 0 && (
              <div className="form-group">
                <label htmlFor="selectedDiagnostic">Select Diagnostic:</label>
                <select 
                  id="selectedDiagnostic" 
                  value={selectedDiagnosticId || ""} 
                  onChange={handleDiagnosticSelectionChange}
                  className="form-select"
                  required
                >
                  <option value="">-- Select a diagnostic --</option>
                  {diagnostics.map(diagnostic => (
                    <option key={diagnostic.id} value={diagnostic.id}>
                      {getTemplateName(diagnostic.diagnosticTemplateId)} - {new Date(diagnostic.dateDiagnosed).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* New Diagnostic Form */}
            {(!useExistingDiagnostic || diagnostics.length === 0) && (
              <>
                <div className="form-group template-selection-group">
                  <div className="template-header-container">
                    <label htmlFor="diagnosticTemplateId">Diagnostic Template:</label>
                    <button 
                      type="button" 
                      className="manage-templates-button"
                      onClick={() => setShowTemplatesModal(true)}
                    >
                      Manage Templates
                    </button>
                  </div>
                  <select 
                    id="diagnosticTemplateId" 
                    name="diagnosticTemplateId" 
                    value={diagnosticForm.diagnosticTemplateId || ""} 
                    onChange={handleDiagnosticFormChange}
                    className="form-select"
                    required
                  >
                    <option value="">-- Select a template --</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="dateDiagnosed">Date Diagnosed:</label>
                  <input 
                    type="date" 
                    id="dateDiagnosed" 
                    name="dateDiagnosed" 
                    value={diagnosticForm.dateDiagnosed} 
                    onChange={handleDiagnosticFormChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Diagnostic Notes:</label>
                  <textarea 
                    id="notes" 
                    name="notes" 
                    value={diagnosticForm.notes} 
                    onChange={handleDiagnosticFormChange}
                    className="form-textarea"
                    rows={3}
                    placeholder="Enter diagnostic notes here..."
                  />
                </div>
              </>
            )}

            <div className="section-title">
              <h3>Treatment Information</h3>
            </div>

            {/* Treatment Form */}
            <div className="form-group">
              <label htmlFor="name">Treatment Name:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={treatmentForm.name} 
                onChange={handleTreatmentFormChange}
                className="form-input"
                placeholder="e.g., Antibiotics, Physical Therapy"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Treatment Description:</label>
              <textarea 
                id="description" 
                name="description" 
                value={treatmentForm.description} 
                onChange={handleTreatmentFormChange}
                className="form-textarea"
                rows={4}
                placeholder="Enter detailed treatment instructions here..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date:</label>
              <input 
                type="date" 
                id="startDate" 
                name="startDate" 
                value={treatmentForm.startDate} 
                onChange={handleTreatmentFormChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date :</label>
              <input 
                type="date" 
                id="endDate" 
                name="endDate" 
                value={treatmentForm.endDate} 
                onChange={handleTreatmentFormChange}
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Treatment"}
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Diagnostic Templates Modal */}
      {showTemplatesModal && (
        <DiagnosticTemplatesModal
          token={token}
          onClose={() => setShowTemplatesModal(false)}
          onTemplateSelected={handleTemplateSelected}
        />
      )}
    </div>
  );
};

export default TreatmentModal;