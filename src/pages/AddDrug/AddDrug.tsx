import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { drugApi } from '../../services/api';
import { DrugFormData } from '../../types';
import 'react-datepicker/dist/react-datepicker.css';
import './AddDrug.css';

const AddDrug = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [drugData, setDrugData] = useState<DrugFormData>({
    name: '',
    genericName: '',
    category: '',
    description: '',
    manufacturer: '',
    batchNumber: '',
    expiryDate: '',
    unitPrice: 0,
    stock: 0
  });
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  
  // Load drug data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchDrugDetails(id);
    }
  }, [id]);
  
  const fetchDrugDetails = async (drugId: string) => {
    setLoading(true);
    try {
      const response = await drugApi.getDrugById(drugId);
      if (response.success && response.data) {
        const drug = response.data;
        setDrugData({
          name: drug.name,
          genericName: drug.genericName,
          category: drug.category,
          description: drug.description,
          manufacturer: drug.manufacturer,
          batchNumber: drug.batchNumber,
          expiryDate: drug.expiryDate,
          unitPrice: drug.unitPrice,
          stock: drug.stock
        });
        
        // Set expiry date for the DatePicker
        setExpiryDate(new Date(drug.expiryDate));
      } else {
        toast.error(response.error || 'Failed to fetch drug details');
        navigate('/drug-stock');
      }
    } catch (error) {
      console.error('Error fetching drug details:', error);
      toast.error('An unexpected error occurred');
      navigate('/drug-stock');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Name validations
    if (!drugData.name.trim()) {
      errors.name = 'Drug name is required';
    } else if (drugData.name.length < 2) {
      errors.name = 'Drug name must be at least 2 characters';
    } else if (drugData.name.length > 100) {
      errors.name = 'Drug name must not exceed 100 characters';
    }
    
    // Generic name validations
    if (!drugData.genericName.trim()) {
      errors.genericName = 'Generic name is required';
    } else if (drugData.genericName.length < 2) {
      errors.genericName = 'Generic name must be at least 2 characters';
    }
    
    // Category validation
    if (!drugData.category) {
      errors.category = 'Category is required';
    }
    
    // Manufacturer validation
    if (!drugData.manufacturer.trim()) {
      errors.manufacturer = 'Manufacturer is required';
    }
    
    // Batch number validation
    if (!drugData.batchNumber.trim()) {
      errors.batchNumber = 'Batch number is required';
    } else if (!/^[a-zA-Z0-9-]+$/.test(drugData.batchNumber)) {
      errors.batchNumber = 'Batch number should contain only letters, numbers, and hyphens';
    }
    
    // Expiry date validation
    if (!drugData.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    } else {
      const today = new Date();
      const expiryDate = new Date(drugData.expiryDate);
      if (expiryDate <= today) {
        errors.expiryDate = 'Expiry date must be in the future';
      }
    }
    
    // Unit price validation
    if (!drugData.unitPrice) {
      errors.unitPrice = 'Unit price is required';
    } else if (drugData.unitPrice <= 0) {
      errors.unitPrice = 'Unit price must be greater than zero';
    } else if (drugData.unitPrice > 10000) {
      errors.unitPrice = 'Unit price seems too high, please verify';
    }
    
    // Stock validation
    if (drugData.stock < 0) {
      errors.stock = 'Stock cannot be negative';
    } else if (drugData.stock > 100000) {
      errors.stock = 'Stock value seems too high, please verify';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDrugData({
      ...drugData,
      [name]: name === 'unitPrice' || name === 'stock' ? parseFloat(value) || 0 : value
    });
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleDateChange = (date: Date | null) => {
    setExpiryDate(date);
    if (date) {
      setDrugData({
        ...drugData,
        expiryDate: date.toISOString().split('T')[0]
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Run validation
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      let response;
      
      if (isEditMode && id) {
        // Update existing drug
        response = await drugApi.updateDrug(id, drugData);
      } else {
        // Add new drug
        response = await drugApi.addDrug(drugData);
      }
      
      if (response.success) {
        toast.success(isEditMode ? 'Drug updated successfully!' : 'Drug added successfully!');
        navigate('/drug-stock');
      } else {
        toast.error(response.error || `Failed to ${isEditMode ? 'update' : 'add'} drug`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} drug:`, error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/drug-stock');
  };

  return (
    <div className="add-drug-container">
      <h1 className="page-title">{isEditMode ? 'Update Drug' : 'Add New Drug'}</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="add-drug-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Drug Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                value={drugData.name}
                onChange={handleChange}
                required
              />
              {validationErrors.name && <div className="validation-error">{validationErrors.name}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="genericName">Generic Name *</label>
              <input
                type="text"
                id="genericName"
                name="genericName"
                className={`form-control ${validationErrors.genericName ? 'is-invalid' : ''}`}
                value={drugData.genericName}
                onChange={handleChange}
                required
              />
              {validationErrors.genericName && <div className="validation-error">{validationErrors.genericName}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                className={`form-control ${validationErrors.category ? 'is-invalid' : ''}`}
                value={drugData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Painkiller">Painkiller</option>
                <option value="Antiviral">Antiviral</option>
                <option value="Antifungal">Antifungal</option>
                <option value="Antihistamine">Antihistamine</option>
                <option value="Antidepressant">Antidepressant</option>
                <option value="Steroid">Steroid</option>
                <option value="Vitamin">Vitamin</option>
                <option value="Supplement">Supplement</option>
                <option value="Other">Other</option>
              </select>
              {validationErrors.category && <div className="validation-error">{validationErrors.category}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="manufacturer">Manufacturer *</label>
              <input
                type="text"
                id="manufacturer"
                name="manufacturer"
                className={`form-control ${validationErrors.manufacturer ? 'is-invalid' : ''}`}
                value={drugData.manufacturer}
                onChange={handleChange}
                required
              />
              {validationErrors.manufacturer && <div className="validation-error">{validationErrors.manufacturer}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="batchNumber">Batch Number *</label>
              <input
                type="text"
                id="batchNumber"
                name="batchNumber"
                className={`form-control ${validationErrors.batchNumber ? 'is-invalid' : ''}`}
                value={drugData.batchNumber}
                onChange={handleChange}
                required
              />
              {validationErrors.batchNumber && <div className="validation-error">{validationErrors.batchNumber}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="expiryDate">Expiry Date *</label>
              <DatePicker
                id="expiryDate"
                selected={expiryDate}
                onChange={handleDateChange}
                className={`form-control ${validationErrors.expiryDate ? 'is-invalid' : ''}`}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                placeholderText="Select expiry date"
                required
              />
              {validationErrors.expiryDate && <div className="validation-error">{validationErrors.expiryDate}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="unitPrice">Unit Price (USD) *</label>
              <input
                type="number"
                id="unitPrice"
                name="unitPrice"
                className={`form-control ${validationErrors.unitPrice ? 'is-invalid' : ''}`}
                value={drugData.unitPrice || ''}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
              />
              {validationErrors.unitPrice && <div className="validation-error">{validationErrors.unitPrice}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="stock">Initial Stock *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                className={`form-control ${validationErrors.stock ? 'is-invalid' : ''}`}
                value={drugData.stock || ''}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
              {validationErrors.stock && <div className="validation-error">{validationErrors.stock}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={drugData.description}
              onChange={handleChange}
              rows={4}
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Drug' : 'Add Drug')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDrug;
