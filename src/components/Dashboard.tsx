import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import Content from './Content';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Topbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Content />
      </Box>
    </Box>
  );
};

export default Dashboard;
