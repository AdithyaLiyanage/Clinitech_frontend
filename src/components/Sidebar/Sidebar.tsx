import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Clinitech</h2>
        <p>Drug Management System</p>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink 
              to="/drug-stock" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Drug Stock
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/add-drug" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Add Drug
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/expiry-alerts" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Expiry Alerts
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p>&copy; 2023 Clinitech</p>
      </div>
    </div>
  );
};

export default Sidebar;
