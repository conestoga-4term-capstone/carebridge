import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Add, Check, Close } from '@mui/icons-material';
import '../../styles/OfficeManagerModal.css';
import '../../styles/Responsive.css';

interface Office {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface OfficeManagerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (officeId: number) => void;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const OfficeManagerModal: React.FC<OfficeManagerModalProps> = ({ open, onClose, onSelect }) => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [selectedOfficeId, setSelectedOfficeId] = useState<number | null>(null);

  // New office form state
  const [newOffice, setNewOffice] = useState<Omit<Office, 'id'>>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Fetch offices when modal opens
  useEffect(() => {
    if (open) {
      fetchOffices();
    }
  }, [open]);

  const fetchOffices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5156/api/offices');
      
      if (!response.ok) {
        throw new Error('Failed to fetch offices');
      }
      
      const data = await response.json();
      setOffices(data);
    } catch (err) {
      setError('Error loading offices. Please try again.');
      console.error('Error fetching offices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffice = async () => {
    try {
      const response = await fetch('http://localhost:5156/api/offices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOffice),
      });

      if (!response.ok) {
        throw new Error('Failed to create office');
      }

      const data = await response.json();
      
      // Refresh office list
      fetchOffices();
      
      // Reset form and hide it
      setNewOffice({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      });
      setShowCreateForm(false);
      
      // Automatically select the newly created office
      if (data.officeId) {
        setSelectedOfficeId(data.officeId);
      }
    } catch (err) {
      setError('Error creating office. Please try again.');
      console.error('Error creating office:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOffice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectOffice = (officeId: number) => {
    setSelectedOfficeId(officeId);
  };

  const handleConfirmSelection = () => {
    if (selectedOfficeId !== null) {
      onSelect(selectedOfficeId);
      onClose();
    } else {
      setError('Please select an office or create a new one.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Manage Offices
        </Typography>
        
        {error && (
          <Box sx={{ bgcolor: '#ffebee', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* Office List */}
        {loading ? (
          <Typography>Loading offices...</Typography>
        ) : (
          <>
            {offices.length > 0 ? (
              <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                {offices.map((office) => (
                  <ListItem 
                    key={office.id}
                    secondaryAction={
                      selectedOfficeId === office.id ? (
                        <Check color="success" />
                      ) : null
                    }
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: selectedOfficeId === office.id ? '#e3f2fd' : 'transparent',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                    onClick={() => handleSelectOffice(office.id)}
                  >
                    <ListItemText 
                      primary={office.name} 
                      secondary={`${office.address}, ${office.city}, ${office.state} ${office.zipCode}`} 
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{ mb: 2 }}>No offices found. Create a new one.</Typography>
            )}
          </>
        )}

        {/* Create Office Form */}
        {showCreateForm ? (
          <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Create New Office</Typography>
            
            <TextField
              fullWidth
              label="Office Name"
              name="name"
              value={newOffice.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={newOffice.address}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={newOffice.city}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="State"
                name="state"
                value={newOffice.state}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Zip Code"
                name="zipCode"
                value={newOffice.zipCode}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<Close />}
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCreateOffice}
                disabled={!newOffice.name || !newOffice.address || !newOffice.city || !newOffice.state || !newOffice.zipCode}
              >
                Create Office
              </Button>
            </Box>
          </Box>
        ) : (
          <Button 
            variant="outlined" 
            startIcon={<Add />} 
            onClick={() => setShowCreateForm(true)}
            sx={{ mb: 2 }}
          >
            Create New Office
          </Button>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmSelection}
            disabled={selectedOfficeId === null}
          >
            Confirm Selection
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default OfficeManagerModal;