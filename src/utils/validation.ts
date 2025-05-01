import { Drug, DrugFormData } from '../types';

export const validateDrugForm = (data: DrugFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // Name validations
  if (!data.name.trim()) {
    errors.name = 'Drug name is required';
  } else if (data.name.length < 2) {
    errors.name = 'Drug name must be at least 2 characters';
  } else if (data.name.length > 100) {
    errors.name = 'Drug name must not exceed 100 characters';
  }
  
  // Generic name validations
  if (!data.genericName.trim()) {
    errors.genericName = 'Generic name is required';
  } else if (data.genericName.length < 2) {
    errors.genericName = 'Generic name must be at least 2 characters';
  }
  
  // Category validation
  if (!data.category) {
    errors.category = 'Category is required';
  }
  
  // Manufacturer validation
  if (!data.manufacturer.trim()) {
    errors.manufacturer = 'Manufacturer is required';
  }
  
  // Batch number validation
  if (!data.batchNumber.trim()) {
    errors.batchNumber = 'Batch number is required';
  } else if (!/^[a-zA-Z0-9-]+$/.test(data.batchNumber)) {
    errors.batchNumber = 'Batch number should contain only letters, numbers, and hyphens';
  }
  
  // Expiry date validation
  if (!data.expiryDate) {
    errors.expiryDate = 'Expiry date is required';
  } else {
    try {
      const today = new Date();
      const expiryDate = new Date(data.expiryDate);
      if (isNaN(expiryDate.getTime())) {
        errors.expiryDate = 'Invalid date format';
      } else if (expiryDate <= today) {
        errors.expiryDate = 'Expiry date must be in the future';
      }
    } catch (error) {
      errors.expiryDate = 'Invalid date';
    }
  }
  
  // Unit price validation
  if (data.unitPrice <= 0) {
    errors.unitPrice = 'Unit price must be greater than zero';
  } else if (data.unitPrice > 10000) {
    errors.unitPrice = 'Unit price seems too high, please verify';
  }
  
  // Stock validation
  if (data.stock < 0) {
    errors.stock = 'Stock cannot be negative';
  } else if (data.stock > 100000) {
    errors.stock = 'Stock value seems too high, please verify';
  }
  
  return errors;
};

export const validateDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
};

export const sanitizeDrugData = (drug: Drug): Drug => {
  return {
    ...drug,
    id: drug.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
    name: drug.name || 'Unknown Drug',
    genericName: drug.genericName || 'Unknown',
    category: drug.category || 'Uncategorized',
    description: drug.description || '',
    manufacturer: drug.manufacturer || 'Unknown',
    batchNumber: drug.batchNumber || 'Unknown',
    expiryDate: validateDate(drug.expiryDate),
    unitPrice: typeof drug.unitPrice === 'number' && !isNaN(drug.unitPrice) ? drug.unitPrice : 0,
    stock: typeof drug.stock === 'number' && !isNaN(drug.stock) ? drug.stock : 0,
    status: ['Available', 'Low Stock', 'Expired'].includes(drug.status) ? drug.status : 'Available',
    createdAt: drug.createdAt || new Date().toISOString(),
    updatedAt: drug.updatedAt || new Date().toISOString()
  };
};
