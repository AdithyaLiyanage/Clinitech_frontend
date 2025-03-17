import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { Box } from '@mui/material';

const App: React.FC = () => {
  return (
    <Router>
      <Box display="flex">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
