import React, { useState, useEffect } from 'react';
import { User, MapPin, X, Save, Plus, Heart } from 'lucide-react';
import './styles/EditModal.css';

const EditModal = ({ isOpen, onClose, customer, onSave, countries, saving, isCreatingNew }) => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    gender: ''
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        country: customer.country || '',
        gender: customer.gender || ''
      });
    } else {
      setFormData({
        name: '',
        country: '',
        gender: ''
      });
    }
  }, [customer, isCreatingNew]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.country && formData.gender) {
      onSave(formData);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title-section">
            <div className={`modal-icon ${isCreatingNew ? 'create' : 'edit'}`}>
              {isCreatingNew ? <Plus size={20} /> : <User size={20} />}
            </div>
            <div>
              <h2>{isCreatingNew ? 'Add New Customer' : 'Edit Customer'}</h2>
              <p className="modal-subtitle">
                {isCreatingNew ? 'Create a new customer profile' : 'Update customer information'}
              </p>
            </div>
          </div>
          <button className="close-button" onClick={onClose} disabled={saving}>
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              <User size={16} />
              Customer Name
              <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter customer name"
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Heart size={16} />
              Gender
              <span className="required-asterisk">*</span>
            </label>
            <select
              className="form-select"
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              required
              disabled={saving}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <MapPin size={16} />
              Country
              <span className="required-asterisk">*</span>
            </label>
            <select
              className="form-select"
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              required
              disabled={saving}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`save-button ${isCreatingNew ? 'create' : 'edit'}`}
              disabled={!formData.name || !formData.country || !formData.gender || saving}
            >
              {saving ? (
                <div className="loading-spinner-small"></div>
              ) : (
                <>
                  {isCreatingNew ? <Plus size={16} /> : <Save size={16} />}
                  {isCreatingNew ? 'Create Customer' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;