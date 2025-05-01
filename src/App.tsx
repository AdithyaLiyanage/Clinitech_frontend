import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './pages/Dashboard';
import { Box } from '@mui/material';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <Box display="flex">
        <Routes>
          <Route path="/" element={<Navigation />} />
        </Routes>
      </Box>
      <Footer />
    </Router>
  );
};

export default App;
