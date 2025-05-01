import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { drugApi } from '../../services/api';
import { Drug } from '../../types';
import './ExpiryAlerts.css';

const ExpiryAlerts = () => {
  const [expiringDrugs, setExpiringDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [dataValidationErrors, setDataValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    // Check backend connection first
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      // Make a simple request to check if the backend is up
      const response = await fetch('/api/health-check', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
        fetchExpiringDrugs();
      } else {
        setConnectionStatus('error');
        setError('Backend server is running but returned an error');
        toast.error('Connection to backend established but returned an error');
      }
    } catch (err) {
      console.error('Backend connection error:', err);
      setConnectionStatus('disconnected');
      setError('Cannot connect to backend server. Please check if server is running on port 5000.');
      toast.error('Failed to connect to backend. Is the server running?');
      setLoading(false);
    }
  };

  const fetchExpiringDrugs = async () => {
    setLoading(true);
    setError(null);
    setDataValidationErrors([]);
    try {
      const response = await drugApi.getExpiringDrugs();
      if (response.success && response.data) {
        // Validate the expiring drugs data
        const { validatedData, errors } = validateExpiringDrugsData(response.data);
        setExpiringDrugs(validatedData);
        
        if (errors.length > 0) {
          setDataValidationErrors(errors);
          toast.warning('Some data may have issues. See details below.');
        }
      } else {
        setError(response.error || 'Failed to fetch expiring drugs');
        toast.error(response.error || 'Failed to fetch expiring drugs');
      }
    } catch (error) {
      console.error('Error fetching expiring drugs:', error);
      setError('An unexpected error occurred. The backend may not be running.');
      toast.error('Failed to connect to the API.');
    } finally {
      setLoading(false);
    }
  };

  const validateExpiringDrugsData = (drugs: Drug[]): { validatedData: Drug[], errors: string[] } => {
    const errors: string[] = [];
    const validatedData = drugs.map(drug => {
      // Check for required fields
      if (!drug.id || !drug.name || !drug.expiryDate) {
        errors.push(`Drug "${drug.name || 'Unknown'}" has missing required fields`);
      }
      
      // Validate expiry date format
      let expiryDate = drug.expiryDate;
      try {
        const date = new Date(drug.expiryDate);
        if (isNaN(date.getTime())) {
          errors.push(`Drug "${drug.name}" has invalid expiry date format`);
          expiryDate = new Date().toISOString(); // Default to current date
        }
      } catch {
        errors.push(`Drug "${drug.name}" has invalid expiry date format`);
        expiryDate = new Date().toISOString(); // Default to current date
      }
      
      // Return validated drug with defaults for missing values
      return {
        ...drug,
        id: drug.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
        name: drug.name || 'Unknown Drug',
        genericName: drug.genericName || 'Unknown',
        category: drug.category || 'Uncategorized',
        batchNumber: drug.batchNumber || 'Unknown',
        expiryDate: expiryDate,
        unitPrice: typeof drug.unitPrice === 'number' ? drug.unitPrice : 0,
        stock: typeof drug.stock === 'number' ? drug.stock : 0
      };
    });
    
    return { validatedData, errors };
  };

  const getDaysUntilExpiry = (expiryDate: string): number => {
    try {
      const today = new Date();
      const expiry = new Date(expiryDate);
      
      // Validate date is valid
      if (isNaN(expiry.getTime())) {
        console.warn(`Invalid expiry date: ${expiryDate}`);
        return 0;
      }
      
      const diffTime = expiry.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error('Error calculating days until expiry:', error);
      return 0;
    }
  };

  const handleRetry = () => {
    setLoading(true);
    checkBackendConnection();
  };

  return (
    <div className="expiry-alerts-container">
      <h1 className="page-title">Expiry Alerts</h1>
      
      {connectionStatus === 'disconnected' && (
        <div className="alert alert-danger">
          <div>
            <strong>Backend Connection Error:</strong> Cannot connect to the backend server.
            <p>Check if your backend is running on port 5000 or restart the server.</p>
          </div>
          <button className="retry-button" onClick={handleRetry}>
            Retry Connection
          </button>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
          <button className="retry-button" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}
      
      {dataValidationErrors.length > 0 && (
        <div className="alert alert-warning data-validation-alert">
          <div>
            <strong>Data Validation Issues:</strong>
            <ul className="validation-list">
              {dataValidationErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {!error && (
        <div className="alert alert-warning">
          <strong>Warning!</strong> The following drugs will expire within 30 days.
        </div>
      )}

      {loading ? (
        <div className="loading">Loading expiring drugs...</div>
      ) : (
        <>
          {expiringDrugs.length === 0 ? (
            <div className="card no-alerts">
              <p>Good news! No drugs are expiring within the next 30 days.</p>
            </div>
          ) : (
            <div className="card">
              <div className="table-responsive">
                <table className="expiry-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Generic Name</th>
                      <th>Category</th>
                      <th>Batch Number</th>
                      <th>Expiry Date</th>
                      <th>Days Remaining</th>
                      <th>Stock</th>
                      <th>Unit Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiringDrugs
                      .sort((a, b) => {
                        const daysA = getDaysUntilExpiry(a.expiryDate);
                        const daysB = getDaysUntilExpiry(b.expiryDate);
                        return daysA - daysB;
                      })
                      .map(drug => {
                        const daysRemaining = getDaysUntilExpiry(drug.expiryDate);
                        
                        return (
                          <tr key={drug.id} className={daysRemaining <= 10 ? 'critical' : 'warning'}>
                            <td>{drug.name}</td>
                            <td>{drug.genericName}</td>
                            <td>{drug.category}</td>
                            <td>{drug.batchNumber}</td>
                            <td>{new Date(drug.expiryDate).toLocaleDateString()}</td>
                            <td className="days-remaining">
                              <span className={`days-badge ${daysRemaining <= 10 ? 'critical' : 'warning'}`}>
                                {daysRemaining} days
                              </span>
                            </td>
                            <td>{drug.stock}</td>
                            <td>${drug.unitPrice.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpiryAlerts;
