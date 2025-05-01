import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Sidebar from './components/Sidebar/Sidebar';
import AddDrug from './pages/AddDrug/AddDrug';
import DrugStock from './pages/DrugStock/DrugStock';
import ExpiryAlerts from './pages/ExpiryAlerts/ExpiryAlerts';
import './App.css';

function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<DrugStock />} />
          <Route path="/add-drug" element={<AddDrug />} />
          <Route path="/add-drug/:id" element={<AddDrug />} /> {/* Added route for editing */}
          <Route path="/drug-stock" element={<DrugStock />} />
          <Route path="/expiry-alerts" element={<ExpiryAlerts />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
