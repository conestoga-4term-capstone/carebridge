import React, { useState, useEffect } from "react";
import "../../styles/HealthRecordsModal.css";
import PatientPrescriptionsModal from "./PatientPrescriptionsModal";
import DiagnosticsModal from "./DiagnosticsModal";
import '../../styles/Responsive.css';

// Define interfaces for the patient data
interface PatientData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

// Define props for the component
interface HealthRecordsModalProps {
  patient: PatientData;
  token: string;
  userRole: number; // 0 = Doctor, 1 = Patient, 2 = Assistant
  onClose: () => void;
}

const HealthRecordsModal: React.FC<HealthRecordsModalProps> = ({
  patient,
  token,
  userRole,
  onClose,
}) => {
  // Add console log to debug the patient data we're receiving
  console.log("Patient data in HealthRecordsModal:", patient);
  
  // State to control showing prescriptions modal
  const [showPrescriptionsModal, setShowPrescriptionsModal] = useState<boolean>(false);
  
  // State to control showing treatment modal
  const [showTreatmentModal, setShowTreatmentModal] = useState<boolean>(false);

  // State to store additional patient data that might be fetched separately
  const [patientDetails, setPatientDetails] = useState<any>(null);

  // Effect to fetch additional patient details if needed
  useEffect(() => {
    // If dateOfBirth is missing, we might need to fetch additional details
    if (!patient.dateOfBirth && patient.id) {
      fetchPatientDetails(patient.id);
    }
  }, [patient.id, patient.dateOfBirth]);

  // Function to fetch additional patient details if needed
  const fetchPatientDetails = async (patientId: number) => {
    try {
      const response = await fetch(`http://localhost:5156/api/patients/${patientId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Additional patient details:", data);
        setPatientDetails(data);
      } else {
        console.error("Failed to fetch additional patient details");
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  // Format date of birth if available
  const formatDateOfBirth = (dateString?: string): string => {
    if (!dateString) {
      // Try to get dateOfBirth from additional patient details
      if (patientDetails?.dateOfBirth) {
        dateString = patientDetails.dateOfBirth;
      } else {
        return "Not provided";
      }
    }
    
    // Check if the date is valid
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date format:", dateString);
      return "Invalid date format";
    }
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
  };
  

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth?: string): string => {
    // Use patientDetails.dateOfBirth as fallback
    if (!dateOfBirth && patientDetails?.dateOfBirth) {
      dateOfBirth = patientDetails.dateOfBirth;
    }
    
    if (!dateOfBirth) return "Unknown";
    
    const birthDate = new Date(dateOfBirth);
    // Check if date is valid
    if (isNaN(birthDate.getTime())) {
      return "Unknown";
    }
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  // Get the effective dateOfBirth (from patient or patientDetails)
  const getEffectiveDateOfBirth = (): string => {
    return patient.dateOfBirth || (patientDetails?.dateOfBirth || "");
  };

  return (
    <div className="modal-backdrop">
      <div className="health-records-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Patient Health Records</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Patient Information Section */}
          <div className="patient-info-section">
            <h3>Patient Information</h3>
            <div className="patient-details">
              <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Phone:</strong> {patient.phoneNumber || "Not provided"}</p>
              <p><strong>Date of Birth:</strong> {formatDateOfBirth(getEffectiveDateOfBirth())}</p>
              <p><strong>Age:</strong> {calculateAge(getEffectiveDateOfBirth())}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="health-record-actions">
            <button 
              className="prescriptions-button" 
              onClick={() => setShowPrescriptionsModal(true)}
            >
              View Prescriptions
            </button>
            
            <button 
              className="treatment-button" 
              onClick={() => setShowTreatmentModal(true)}
            >
              Treatment History
            </button>
          </div>
        </div>
      </div>

      {/* Patient Prescriptions Modal */}
      {showPrescriptionsModal && (
        <PatientPrescriptionsModal
          patientId={patient.id}
          patientName={`${patient.firstName} ${patient.lastName}`}
          token={token}
          userRole={userRole}
          onClose={() => setShowPrescriptionsModal(false)}
        />
      )}

      {/* Treatment History Modal */}
      {showTreatmentModal && (
        <DiagnosticsModal
          patientId={patient.id}
          patientName={`${patient.firstName} ${patient.lastName}`}
          token={token}
          onClose={() => setShowTreatmentModal(false)}
        />
      )}
    </div>
  );
};

export default HealthRecordsModal;