import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/signup.css';
import OfficeManagerModal from './OfficeManagerModal';
import { Button } from '@mui/material';
import '../../styles/Responsive.css';

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: number;
  dateOfBirth: string;
  specialization?: string;
  licenseNumber?: string;
  officeId?: number;
}

const Signup = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SignUpFormValues>();
  const navigate = useNavigate();
  // Store backend error messages
  const [apiError, setApiError] = useState<string | null>(null); 
  // Add loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Modal state
  const [officeModalOpen, setOfficeModalOpen] = useState<boolean>(false);
  // Selected office state
  const [selectedOffice, setSelectedOffice] = useState<{ id: number; name: string } | null>(null);
  
  // Watch the selected role in real-time
  const selectedRole = Number(watch("role")); 
  
  const handleOfficeSelect = (officeId: number) => {
    // Fetch the office name for display
    fetch(`http://localhost:5156/api/offices/${officeId}`)
      .then(response => response.json())
      .then(data => {
        setSelectedOffice({ id: officeId, name: data.name });
        setValue('officeId', officeId);
      })
      .catch(error => {
        console.error('Error fetching office details:', error);
        // Still set the ID even if we can't get the name
        setSelectedOffice({ id: officeId, name: `Office ID: ${officeId}` });
        setValue('officeId', officeId);
      });
  };
  
  const onSubmit = async (data: SignUpFormValues) => {
    // Reset error before new request
    setApiError(null);
    // Set submitting state to true
    setIsSubmitting(true);
    
    const formattedData = {
      ...data,
      role: Number(data.role), // Ensure role is sent as an integer
      specialization: Number(data.role) === 0 ? data.specialization : null,
      licenseNumber: Number(data.role) === 0 ? data.licenseNumber : null,
      officeId: Number(data.role) === 0 ? data.officeId : null,
    };
    
    try {
      const response = await fetch('http://localhost:5156/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        
        // Show success toast message
        toast.success('Registration successful! Redirecting to dashboard...', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Wait for 2 seconds before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        // Handle error responses
        const errorData = await response.json();
        console.error('Failed to register user', errorData);

        // Extract meaningful error message
        if (typeof errorData === 'string') {
          setApiError(errorData); // If the API returns a simple string message
        } else if (errorData.message) {
          setApiError(errorData.message); // If API uses `{ message: "Error description" }`
        } else if (errorData.errors) {
          // Handle validation errors (like missing fields)
          const firstError = Object.values(errorData.errors)[0] as string[];
          setApiError(firstError ? firstError[0] : 'Something went wrong.');
        } else {
          setApiError('Registration failed. Please try again.');
        }
        
        // Show error toast
        toast.error('Registration failed. Please check the form and try again.');
      }
    } catch (error) {
      console.error('Error connecting to the API\n', error);
      setApiError('Could not connect to the server. Please try again later.');
      toast.error('Could not connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='signup-body'>
      <ToastContainer />
      <div className="signup-container">
        <h1>Get Started</h1>
        <p>Already have an account? <a href="/login" className="signup-link">Sign in</a></p>
        
        {/* Show backend error */}
        {apiError && <p className="error-message api-error">{apiError}</p>} 

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="input-label" htmlFor="firstName">First Name</label>
          <input
            className="text-field"
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            {...register('firstName', { required: 'First name is required' })}
          />
          {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}

          <label className="input-label" htmlFor="lastName">Last Name</label>
          <input
            className="text-field"
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            {...register('lastName', { required: 'Last name is required' })}
          />
          {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}

          <label className="input-label" htmlFor="email">Email</label>
          <input
            className="text-field"
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email', { 
              required: 'Email is required', 
              pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Enter a valid email' } 
            })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}

          <label className="input-label" htmlFor="phoneNumber">Phone Number</label>
          <input
            className="text-field"
            id="phoneNumber"
            type="text"
            placeholder="456-789-0123"
            {...register('phoneNumber', { 
              required: 'Phone number is required', 
              pattern: { value: /^\d{3}-\d{3}-\d{4}$/, message: 'Enter a valid phone number (e.g., 456-789-0123)' } 
            })}
          />
          {errors.phoneNumber && <p className="error-message">{errors.phoneNumber.message}</p>}

          <label className="input-label" htmlFor="password">Password</label>
          <input
            className="text-field"
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register('password', { 
              required: 'Password is required', 
              minLength: { value: 6, message: 'Password must be at least 6 characters' } 
            })}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}

          <label className="input-label" htmlFor="role">Role</label>
          <select
            className="text-field"
            id="role"
            {...register('role', { required: 'Role is required' })}
          >
            <option value="-1">Select Role</option>
            <option value="1">Patient</option>
            <option value="0">Doctor</option>
            <option value="2">Medical Staff</option>
          </select>
          {errors.role && <p className="error-message">{errors.role.message}</p>}

          {selectedRole === 0 && ( 
            <>
              <label className="input-label" htmlFor="specialization">Specialization</label>
              <input
                className="text-field"
                id="specialization"
                type="text"
                placeholder="Enter your specialization"
                {...register('specialization', { required: selectedRole === 0 ? 'Specialization is required' : false })}
              />
              {errors.specialization && <p className="error-message">{errors.specialization.message}</p>}

              <label className="input-label" htmlFor="licenseNumber">License Number</label>
              <input
                className="text-field"
                id="licenseNumber"
                type="text"
                placeholder="Enter your license number"
                {...register('licenseNumber', { required: selectedRole === 0 ? 'License number is required' : false })}
              />
              {errors.licenseNumber && <p className="error-message">{errors.licenseNumber.message}</p>}
              
              {/* Office Selection */}
              <label className="input-label" htmlFor="office">Office</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                <input
                  className="text-field"
                  style={{ flex: 1, cursor: 'pointer', backgroundColor: '#f5f5f5' }}
                  id="office"
                  type="text"
                  placeholder="Select an office"
                  value={selectedOffice ? selectedOffice.name : ''}
                  readOnly
                  onClick={() => setOfficeModalOpen(true)}
                />
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={() => setOfficeModalOpen(true)}
                  style={{ height: '40px' }}
                >
                  Select
                </Button>
              </div>
              <input
                type="hidden"
                {...register('officeId', { 
                  required: selectedRole === 0 ? 'Office selection is required' : false 
                })}
              />
              {errors.officeId && <p className="error-message">{errors.officeId.message}</p>}
            </>
          )}

          <label className="input-label" htmlFor="dateOfBirth">Date of Birth</label>
          <input
            className="text-field"
            id="dateOfBirth"
            type="date"
            {...register('dateOfBirth', { required: 'Date of birth is required' })}
          />
          {errors.dateOfBirth && <p className="error-message">{errors.dateOfBirth.message}</p>}

          <div className="button-container">
            <button 
              className="button" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
            <button 
              className="button cancel-button" 
              type="button" 
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Office Manager Modal */}
      <OfficeManagerModal
        open={officeModalOpen}
        onClose={() => setOfficeModalOpen(false)}
        onSelect={handleOfficeSelect}
      />
    </div>
  );
};

export default Signup;