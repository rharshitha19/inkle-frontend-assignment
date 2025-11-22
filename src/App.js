import React, { useState, useEffect } from 'react';
import TaxTable from './components/TaxTable';
import EditModal from './components/EditModal';
import { api } from './services/api';
import './components/styles/App.css';

function App() {
  const [taxData, setTaxData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [taxesResponse, countriesResponse] = await Promise.all([
        api.getTaxes(),
        api.getCountries()
      ]);
      
      console.log('Loaded taxes:', taxesResponse.data);
      console.log('Loaded countries:', countriesResponse.data);
      
      setTaxData(taxesResponse.data || []);
      setCountries(countriesResponse.data || []);
      
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsCreatingNew(false);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setIsCreatingNew(true);
    setIsModalOpen(true);
  };

  const handleSave = async (customerData) => {
    try {
      setSaving(true);
      
      if (isCreatingNew) {
        // Create new customer
        const newCustomer = {
          name: customerData.name,
          country: customerData.country,
          gender: customerData.gender,
          createdAt: new Date().toISOString()
        };
        
        console.log('Creating new customer:', newCustomer);
        const response = await api.createTax(newCustomer);
        const createdCustomer = response.data;
        
        setTaxData(prevData => [createdCustomer, ...prevData]);
        console.log('New customer created successfully!');
        
      } else {
        // Update existing customer
        const updatedCustomer = {
          ...editingCustomer,
          name: customerData.name,
          country: customerData.country,
          gender: customerData.gender
        };
        
        console.log('Updating customer:', updatedCustomer);
        const response = await api.updateTax(updatedCustomer.id, updatedCustomer);
        
        // Update local state with response data
        setTaxData(prevData =>
          prevData.map(item =>
            item.id === updatedCustomer.id ? response.data : item
          )
        );
        
        console.log('Customer updated successfully!');
      }
      
    } catch (err) {
      console.error('Save error:', err);
      setError(`Failed to ${isCreatingNew ? 'create' : 'update'} customer. Please try again.`);
    } finally {
      setSaving(false);
      setIsModalOpen(false);
      setEditingCustomer(null);
      setIsCreatingNew(false);
    }
  };

  const handleCloseModal = () => {
    if (!saving) {
      setIsModalOpen(false);
      setEditingCustomer(null);
      setIsCreatingNew(false);
    }
  };

  const handleRetry = () => {
    loadData();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Customer Management</h1>
          <p className="header-subtitle">Manage your customer information</p>
        </div>
      </header>
      
      <main className="app-main">
        {loading ? (
          <div className="app-loading">
            <div className="loading-spinner-large"></div>
            <div className="loading-text">Loading data...</div>
          </div>
        ) : error ? (
          <div className="app-error">
            <div className="error-icon">⚠️</div>
            <div className="error-message">{error}</div>
            <button onClick={handleRetry} className="retry-button">
              Try Again
            </button>
          </div>
        ) : (
          <TaxTable 
            data={taxData} 
            onEdit={handleEdit}
            onAddNew={handleAddNew}
            countries={countries}
          />
        )}
      </main>

      <EditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        customer={editingCustomer}
        onSave={handleSave}
        countries={countries}
        saving={saving}
        isCreatingNew={isCreatingNew}
      />

      <footer className="app-footer">
        <div className="footer-content">
          <p> </p>
        </div>
      </footer>
    </div>
  );
}

export default App;