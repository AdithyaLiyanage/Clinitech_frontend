// PatientPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

interface Patient {
  name: string;
  age: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  billAmount: string;
  billDate: string;
  paymentStatus: string;
}

const PatientPage: React.FC = () => {
  // State for form inputs and list of patients
  const [patientData, setPatientData] = useState<Patient>({
    name: '',
    age: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    billAmount: '',
    billDate: '',
    paymentStatus: '',
  });
  const [patients, setPatients] = useState<Patient[]>([]);

  // Handle changes in any of the input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission: add a new patient record and reset form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPatients((prev) => [...prev, patientData]);
    setPatientData({
      name: '',
      age: '',
      gender: '',
      address: '',
      phone: '',
      email: '',
      billAmount: '',
      billDate: '',
      paymentStatus: '',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Patient Management
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        {/* Patient Details Section */}
        <Typography variant="h6" gutterBottom>
          Patient Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={patientData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Age"
              name="age"
              type="number"
              value={patientData.age}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Gender"
              name="gender"
              value={patientData.gender}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={patientData.address}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              value={patientData.phone}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={patientData.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        {/* Bill Details Section */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Bill Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Bill Amount"
              name="billAmount"
              type="number"
              value={patientData.billAmount}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Bill Date"
              name="billDate"
              type="date"
              value={patientData.billDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Payment Status"
              name="paymentStatus"
              value={patientData.paymentStatus}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Patient
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Table displaying the list of patients */}
      <TableContainer component={Paper}>
        <Table aria-label="patients table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Bill Amount</TableCell>
              <TableCell>Bill Date</TableCell>
              <TableCell>Payment Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient, index) => (
              <TableRow key={index}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.address}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.billAmount}</TableCell>
                <TableCell>{patient.billDate}</TableCell>
                <TableCell>{patient.paymentStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PatientPage;
