import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { drugApi } from '../../services/api';
import { Drug, ChartData } from '../../types';
import './DrugStock.css';

const COLORS = ['#4caf50', '#ff9800', '#f44336'];
const STATUS_COLORS = {
  'Available': '#4caf50',
  'Low Stock': '#ff9800',
  'Expired': '#f44336'
};

const DrugStock = () => {
  const navigate = useNavigate();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [dataLoadError, setDataLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetchDrugs();
  }, []);

  const fetchDrugs = async () => {
    setLoading(true);
    setDataLoadError(null);
    try {
      const response = await drugApi.getAllDrugs();
      if (response.success && response.data) {
        const validatedData = validateDrugData(response.data);
        setDrugs(validatedData);
      } else {
        setDataLoadError(response.error || 'Failed to fetch drugs');
        toast.error(response.error || 'Failed to fetch drugs');
      }
    } catch (error) {
      console.error('Error fetching drugs:', error);
      setDataLoadError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const validateDrugData = (drugsData: Drug[]): Drug[] => {
    return drugsData.map(drug => {
      return {
        ...drug,
        name: drug.name || 'Unnamed Drug',
        genericName: drug.genericName || 'Unknown',
        category: drug.category || 'Uncategorized',
        description: drug.description || '',
        manufacturer: drug.manufacturer || 'Unknown',
        batchNumber: drug.batchNumber || 'Unknown',
        expiryDate: drug.expiryDate ? validateDate(drug.expiryDate) : new Date().toISOString(),
        unitPrice: typeof drug.unitPrice === 'number' && !isNaN(drug.unitPrice) ? drug.unitPrice : 0,
        stock: typeof drug.stock === 'number' && !isNaN(drug.stock) ? drug.stock : 0,
        status: ['Available', 'Low Stock', 'Expired'].includes(drug.status) ? drug.status : 'Available',
      };
    });
  };

  const validateDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  const handleDeleteDrug = async (id: string) => {
    const drugToDelete = drugs.find(d => d.id === id);
    
    if (!drugToDelete) {
      toast.error('Drug not found');
      return;
    }
    
    const confirmMessage = `Are you sure you want to delete "${drugToDelete.name}"? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await drugApi.deleteDrug(id);
        if (response.success) {
          setDrugs(drugs.filter(drug => drug.id !== id));
          toast.success('Drug deleted successfully');
        } else {
          toast.error(response.error || 'Failed to delete drug');
        }
      } catch (error) {
        console.error('Error deleting drug:', error);
        toast.error('An unexpected error occurred');
      }
    }
  };

  const handleEditClick = (drug: Drug) => {
    navigate(`/add-drug/${drug.id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value.length > 50) {
      setSearchError('Search term is too long');
      return;
    }
    
    if (/[<>{}]/.test(value)) {
      setSearchError('Search contains invalid characters');
      return;
    }
    
    setSearchError(null);
    setSearchTerm(value);
  };

  const filteredDrugs = drugs.filter(drug => 
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const barChartData = drugs.slice(0, 10).map(drug => ({
    name: drug.name,
    stock: drug.stock
  }));

  const prepareStatusData = (): ChartData[] => {
    const statusCount: Record<string, number> = {
      'Available': 0,
      'Low Stock': 0,
      'Expired': 0
    };
    
    drugs.forEach(drug => {
      statusCount[drug.status]++;
    });
    
    return Object.entries(statusCount).map(([name, value]) => ({
      name,
      value
    }));
  };

  const pieChartData = prepareStatusData();

  return (
    <div className="drug-stock-container">
      <div className="drug-stock-header">
        <h1 className="page-title">Drug Stock Inventory</h1>
        <div className="drug-stock-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search drugs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`search-input ${searchError ? 'is-invalid' : ''}`}
            />
            {searchError && <div className="validation-error search-error">{searchError}</div>}
          </div>
          <Link to="/add-drug" className="btn">
            Add New Drug
          </Link>
        </div>
      </div>

      {dataLoadError && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {dataLoadError}
          <button className="retry-button" onClick={fetchDrugs}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading drug inventory...</div>
      ) : (
        <>
          {drugs.length === 0 ? (
            <div className="no-drugs-message">
              <p>No drugs in inventory. Start by adding some drugs.</p>
              <Link to="/add-drug" className="btn">
                Add First Drug
              </Link>
            </div>
          ) : (
            <>
              <div className="charts-container">
                <div className="chart-card">
                  <h2>Stock Levels</h2>
                  <div className="chart">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />                        cd d:\Clinitech\backend
                        npm install
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="stock" fill="#4a90e2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="chart-card">
                  <h2>Status Distribution</h2>
                  <div className="chart">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {pieChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="table-responsive">
                  <table className="drug-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Generic Name</th>
                        <th>Category</th>
                        <th>Manufacturer</th>
                        <th>Batch No.</th>
                        <th>Expiry Date</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Unit Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDrugs.map(drug => (
                        <tr key={drug.id}>
                          <td>{drug.name}</td>
                          <td>{drug.genericName}</td>
                          <td>{drug.category}</td>
                          <td>{drug.manufacturer}</td>
                          <td>{drug.batchNumber}</td>
                          <td>
                            {new Date(drug.expiryDate).toLocaleDateString()}
                          </td>
                          <td>{drug.stock}</td>
                          <td>
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: STATUS_COLORS[drug.status] }}
                            >
                              {drug.status}
                            </span>
                          </td>
                          <td>${drug.unitPrice.toFixed(2)}</td>
                          <td>
                            <div className="button-group">
                              <button 
                                className="btn btn-sm"
                                onClick={() => handleEditClick(drug)}
                              >
                                Update
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteDrug(drug.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DrugStock;
