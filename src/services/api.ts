import axios from 'axios';
import { Drug, ApiResponse, DrugFormData } from '../types';

// Configure axios with defaults
axios.defaults.baseURL = '/api'; // This matches the proxy configuration in vite.config.ts
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for authentication if needed
axios.interceptors.request.use(
  config => {
    // You can add auth token here if required
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for common error handling
axios.interceptors.response.use(
  response => response,
  error => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('API Request Error: No response received', error.request);
    } else {
      // Error in setting up the request
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const drugApi = {
  // Get all drugs
  getAllDrugs: async (): Promise<ApiResponse<Drug[]>> => {
    try {
      const response = await axios.get('/drugs');
      return response.data;
    } catch (error) {
      console.error('Error fetching drugs:', error);
    return { 
        success: false, 
        error: error instanceof Error 
            ? error.message 
            : typeof error === 'string' 
                ? error 
                : 'Failed to fetch drugs' 
    };
    }
  },

  // Get drugs expiring soon
  getExpiringDrugs: async (): Promise<ApiResponse<Drug[]>> => {
    try {
      const response = await axios.get('/drugs/expiring');
      return response.data;
    } catch (error) {
      console.error('Error fetching expiring drugs:', error);
    return { 
        success: false, 
        error: error instanceof Error 
            ? error.message 
            : 'Failed to fetch expiring drugs' 
    };
    }
  },

  // Add a new drug with enhanced validation
  addDrug: async (drug: DrugFormData): Promise<ApiResponse<Drug>> => {
    try {
      const response = await axios.post('/drugs', drug);
      
      // Validate that the response contains the expected data structure
      if (response.data && response.data.success && response.data.data) {
        // Additional validation to ensure required fields are present in the returned drug
        const addedDrug = response.data.data;
        if (!addedDrug.id || !addedDrug.name) {
          console.warn('API returned success but with incomplete drug data', addedDrug);
          return {
            success: true,
            data: addedDrug,
            message: 'Drug added, but some data may be incomplete'
          };
        }
        
        // All validations passed
        return {
          success: true,
          data: addedDrug,
          message: 'Drug added successfully!'
        };
      }
      
      // Backend returned a response but without expected success structure
      return response.data || { 
        success: false, 
        error: 'Invalid response format from server' 
      };
    } catch (error) {
      console.error('Error adding drug:', error);
      return { 
        success: false, 
        error: error instanceof Error 
          ? error.message 
          : typeof error === 'string' 
            ? error 
            : 'Failed to add drug'
      };
    }
  },

  // Update a drug
  updateDrug: async (id: string, drug: Partial<DrugFormData>): Promise<ApiResponse<Drug>> => {
    try {
      const response = await axios.put(`/drugs/${id}`, drug);
      return response.data;
    } catch (error) {
      console.error('Error updating drug:', error);
      return { 
        success: false, 
        error: error instanceof Error 
          ? error.message 
          : typeof error === 'string' 
            ? error 
            : 'Failed to update drug'
      };
    }
  },

  // Delete a drug
  deleteDrug: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.delete(`/drugs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting drug:', error);
      return { 
        success: false, 
        error: error instanceof Error 
          ? error.message 
          : typeof error === 'string' 
            ? error 
            : 'Failed to delete drug'
      };
    }
  },

  // Get a drug by ID
  getDrugById: async (id: string): Promise<ApiResponse<Drug>> => {
    try {
      const response = await axios.get(`/drugs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching drug details:', error);
      return { 
        success: false, 
        error: error instanceof Error 
          ? error.message 
          : typeof error === 'string' 
            ? error 
            : 'Failed to fetch drug details'
      };
    }
  }
};
