import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const currentUserEmail = localStorage.getItem('userEmail');

  const [formData, setFormData] = useState({ fullName: '', street: '', city: '', state: '', pincode: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  
  // NEW: State to track if we are editing an existing address
  const [editAddressId, setEditAddressId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUserEmail) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${encodeURIComponent(currentUserEmail)}`);
        if (response.data && response.data.addresses) {
          setSavedAddresses(response.data.addresses);
        }
      } catch (error) {
        console.error("Failed to load profile data", error);
      }
    };
    fetchProfile();
  }, [currentUserEmail]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SAVE OR UPDATE ADDRESS ---
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      let response;

      // If we have an editAddressId, we are UPDATING an old address
      if (editAddressId) {
        response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/edit-address`, {
          email: currentUserEmail,
          addressId: editAddressId,
          updatedAddress: formData
        });
      } 
      // Otherwise, we are CREATING a new address
      else {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/add-address`, {
          email: currentUserEmail,
          address: formData
        });
      }

      setMessage(response.data.message); 
      if (response.data.addresses) setSavedAddresses(response.data.addresses);
      
      // Clear the form and reset edit mode
      setFormData({ fullName: '', street: '', city: '', state: '', pincode: '' });
      setEditAddressId(null);

    } catch (error) {
      console.error("Failed to save address", error);
      setMessage("Failed to save address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- EDIT BUTTON CLICK ---
  const handleEditClick = (address) => {
    // Fill the text boxes with the chosen address's data
    setFormData({
      fullName: address.fullName,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode
    });
    // Set the ID so the Save button knows we are updating
    setEditAddressId(address._id);
    setMessage('');
  };

  // --- CANCEL EDIT ---
  const cancelEdit = () => {
    setFormData({ fullName: '', street: '', city: '', state: '', pincode: '' });
    setEditAddressId(null);
    setMessage('');
  };

  // --- DELETE BUTTON CLICK ---
  const handleDeleteClick = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      // Send DELETE request with parameters in the URL
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/delete-address/${encodeURIComponent(currentUserEmail)}/${addressId}`
      );
      
      // Instantly remove it from the screen
      if (response.data.addresses) setSavedAddresses(response.data.addresses);
      setMessage("Address deleted successfully.");
      
      // If they deleted the address they were currently editing, clear the form
      if (editAddressId === addressId) cancelEdit();

    } catch (error) {
      console.error("Failed to delete address", error);
      setMessage("Failed to delete address.");
    }
  };

  if (!currentUserEmail) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px' }}>Please login to view your profile.</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', display: 'flex', gap: '30px', flexWrap: 'wrap', fontFamily: 'sans-serif' }}>
      
      {/* LEFT SIDE: The Address Form */}
      <div style={{ flex: '1 1 350px', border: '1px solid #ccc', borderRadius: '8px', padding: '20px', height: 'fit-content' }}>
        <h2 style={{ marginTop: 0, color: editAddressId ? '#2874f0' : 'black' }}>
          {editAddressId ? 'Edit Address' : 'Add New Address'}
        </h2>
        
        {message && (
          <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: message.includes('Failed') ? '#ffcdd2' : '#c8e6c9', borderRadius: '4px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontWeight: 'bold' }}>Full Name</label><br />
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>Street Address</label><br />
            <input type="text" name="street" value={formData.street} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold' }}>City</label><br />
              <input type="text" name="city" value={formData.city} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold' }}>State</label><br />
              <input type="text" name="state" value={formData.state} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>Pincode</label><br />
            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" disabled={isLoading} style={{ flex: 1, padding: '12px', backgroundColor: '#2874f0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {isLoading ? 'Saving...' : (editAddressId ? 'Update Address' : 'Save Address')}
            </button>
            
            {/* Show a Cancel button only if they are editing */}
            {editAddressId && (
              <button type="button" onClick={cancelEdit} style={{ flex: 1, padding: '12px', backgroundColor: '#e0e0e0', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* RIGHT SIDE: Display Saved Addresses */}
      <div style={{ flex: '1 1 350px' }}>
        <h2 style={{ marginTop: 0 }}>Your Saved Addresses</h2>
        
        {savedAddresses.length === 0 ? (
          <p style={{ color: '#666' }}>You have no saved addresses yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {savedAddresses.map((addr) => (
              <div key={addr._id} style={{ border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'relative' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', paddingRight: '80px' , color:'#555'}}>{addr.fullName}</h4>
                <p style={{ margin: '0 0 5px 0', color: '#555' }}>{addr.street}</p>
                <p style={{ margin: '0', color: '#555' }}>{addr.city}, {addr.state} - <strong>{addr.pincode}</strong></p>
                
                {/* ACTION BUTTONS */}
                <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEditClick(addr)} style={{ padding: '5px 10px', fontSize: '12px', cursor: 'pointer', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px' }}>Edit</button>
                  <button onClick={() => handleDeleteClick(addr._id)} style={{ padding: '5px 10px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#ffcdd2', color: '#b71c1c', border: 'none', borderRadius: '4px' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Profile;