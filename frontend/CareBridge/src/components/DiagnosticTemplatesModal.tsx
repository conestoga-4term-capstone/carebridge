import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/HealthRecordsModal.css";

// Interface for diagnostic template
interface DiagnosticTemplate {
  id: number;
  name: string;
  description: string;
  createdByDoctorId: number;
  createdByDoctorName: string;
}

// Template form data interface
interface TemplateFormData {
  name: string;
  description: string;
}

// Props interface
interface DiagnosticTemplatesModalProps {
  token: string;
  onClose: () => void;
  onTemplateSelected?: (template: DiagnosticTemplate) => void;
}

const DiagnosticTemplatesModal: React.FC<DiagnosticTemplatesModalProps> = ({
  token,
  onClose,
  onTemplateSelected
}) => {
  // State for templates list
  const [templates, setTemplates] = useState<DiagnosticTemplate[]>([]);
  // State for loading indicator
  const [loading, setLoading] = useState<boolean>(true);
  // State for errors
  const [error, setError] = useState<string | null>(null);
  // State for showing create/edit form
  const [showForm, setShowForm] = useState<boolean>(false);
  // State for edit mode
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  // State for template being edited
  const [editTemplateId, setEditTemplateId] = useState<number | null>(null);
  // State for template form data
  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    description: ""
  });

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Function to fetch templates
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);

    try {
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
    } catch (error) {
      console.error("Error fetching templates:", error);
      setError(`Failed to load templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error("Failed to load diagnostic templates");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Function to handle creating a new template
  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5156/api/diagnostictemplates", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to create template (Status: ${response.status})`);
      }

      toast.success("Template created successfully");
      setShowForm(false);
      setFormData({ name: "", description: "" });
      await fetchTemplates();
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error(`Failed to create template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle updating a template
  const handleUpdateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTemplateId) return;
    
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5156/api/diagnostictemplates/${editTemplateId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to update template (Status: ${response.status})`);
      }

      toast.success("Template updated successfully");
      setShowForm(false);
      setIsEditMode(false);
      setEditTemplateId(null);
      setFormData({ name: "", description: "" });
      await fetchTemplates();
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error(`Failed to update template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deleting a template
  const handleDeleteTemplate = async (templateId: number) => {
    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5156/api/diagnostictemplates/${templateId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to delete template (Status: ${response.status})`);
      }

      toast.success("Template deleted successfully");
      await fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error(`Failed to delete template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle edit button click
  const handleEditClick = (template: DiagnosticTemplate) => {
    setFormData({
      name: template.name,
      description: template.description
    });
    setEditTemplateId(template.id);
    setIsEditMode(true);
    setShowForm(true);
  };

  // Function to handle selecting a template
  const handleSelectTemplate = (template: DiagnosticTemplate) => {
    if (onTemplateSelected) {
      onTemplateSelected(template);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="diagnostic-templates-modal">
        <div className="modal-header">
          <h2>Diagnostic Templates</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <ToastContainer />

          {!showForm && (
            <div className="templates-actions">
              <button 
                className="create-template-button"
                onClick={() => {
                  setIsEditMode(false);
                  setFormData({ name: "", description: "" });
                  setShowForm(true);
                }}
              >
                Create New Template
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && !showForm && (
            <div className="modal-loading">
              <p>Loading templates...</p>
            </div>
          )}

          {/* Error State */}
          {error && !showForm && (
            <div className="modal-error">
              <p>{error}</p>
              <button onClick={fetchTemplates} className="retry-button">
                Try Again
              </button>
            </div>
          )}

          {/* Template Form */}
          {showForm && (
            <div className="template-form-container">
              <h3>{isEditMode ? "Edit Template" : "Create New Template"}</h3>
              <form onSubmit={isEditMode ? handleUpdateTemplate : handleCreateTemplate}>
                <div className="form-group">
                  <label htmlFor="name">Template Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="form-input"
                    placeholder="e.g., Respiratory Infection, Broken Bone"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="form-textarea"
                    rows={4}
                    placeholder="Enter detailed description of this diagnostic template..."
                    required
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="save-button"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : isEditMode ? "Update Template" : "Create Template"}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setShowForm(false);
                      setIsEditMode(false);
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Templates List */}
          {!showForm && !loading && !error && templates.length === 0 && (
            <div className="no-data-message">
              <p>No diagnostic templates available. Create one to get started.</p>
            </div>
          )}

          {!showForm && !loading && !error && templates.length > 0 && (
            <div className="templates-list">
              {templates.map(template => (
                <div key={template.id} className="template-card">
                  <div className="template-header">
                    <h3>{template.name}</h3>
                    <span className="template-creator">
                      Created by {template.createdByDoctorName}
                    </span>
                  </div>
                  <div className="template-details">
                    <p className="template-description">{template.description}</p>
                  </div>
                  <div className="template-actions">
                    {onTemplateSelected && (
                      <button 
                        className="select-button"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        Select
                      </button>
                    )}
                    <button 
                      className="edit-button"
                      onClick={() => handleEditClick(template)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticTemplatesModal;