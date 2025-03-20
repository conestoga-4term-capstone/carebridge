import React, { useState } from "react";
import "../../styles/MedicalReports.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PatientPrescriptionsModal from "./PatientPrescriptionsModal";
import PatientTreatmentsModal from "./PatientTreatmentsModal";
import '../../styles/Responsive.css';

// Define props for the component
interface MedicalReportsProps {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    role: number;
  };
  token: string;
}

const MedicalReports: React.FC<MedicalReportsProps> = ({ user, token }) => {
  // State for showing prescriptions modal
  const [showPrescriptionsModal, setShowPrescriptionsModal] = useState<boolean>(false);
  // State for showing treatments modal
  const [showTreatmentsModal, setShowTreatmentsModal] = useState<boolean>(false);

  // Full name for display
  const patientName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="dashboard-content">
      <h2>Medical Reports</h2>
      <p className="medical-reports-intro">
        View your medical history, including prescriptions and treatments prescribed by your doctors.
      </p>
      
      <ToastContainer />
      
      <div className="medical-reports-cards">
        {/* Prescriptions Card */}
        <div className="medical-report-card">
          <div className="card-icon prescription-icon">
            <i className="fa fa-file-prescription"></i>
          </div>
          <div className="card-content">
            <h3>Prescriptions</h3>
            <p>View all prescriptions issued by your doctors, including medications and dosage instructions.</p>
            <button 
              className="view-button"
              onClick={() => setShowPrescriptionsModal(true)}
            >
              View Prescriptions
            </button>
          </div>
        </div>
        
        {/* Treatments Card */}
        <div className="medical-report-card">
          <div className="card-icon treatment-icon">
            <i className="fa fa-procedures"></i>
          </div>
          <div className="card-content">
            <h3>Treatments</h3>
            <p>Access your treatment plans, including therapy recommendations and recovery guidelines.</p>
            <button 
              className="view-button"
              onClick={() => setShowTreatmentsModal(true)}
            >
              View Treatments
            </button>
          </div>
        </div>
      </div>
      
      {/* Information Section */}
      <div className="medical-reports-info">
        <h3>Understanding Your Medical Reports</h3>
        <p>
          Your medical reports provide a comprehensive overview of your healthcare journey. 
          Prescriptions contain information about medications prescribed to you, including dosage
          and frequency instructions. Treatments outline procedures, therapies, and other interventions
          recommended by your healthcare providers.
        </p>
        <p>
          If you have any questions about your medical reports, please consult with your doctor
          during your next appointment.
        </p>
      </div>
      
      {/* Prescriptions Modal */}
      {showPrescriptionsModal && (
        <PatientPrescriptionsModal
          patientId={user.id}
          patientName={patientName}
          token={token}
          userRole={user.role}
          onClose={() => setShowPrescriptionsModal(false)}
        />
      )}
      
      {/* Treatments Modal */}
      {showTreatmentsModal && (
        <PatientTreatmentsModal
          patientId={user.id}
          patientName={patientName}
          token={token}
          onClose={() => setShowTreatmentsModal(false)}
        />
      )}
    </div>
  );
};

export default MedicalReports;