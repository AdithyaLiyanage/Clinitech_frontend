import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const Content: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Card 1</Typography>
          <Typography>Some description about card 1.</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Card 2</Typography>
          <Typography>Some description about card 2.</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Card 3</Typography>
          <Typography>Some description about card 3.</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Content;
