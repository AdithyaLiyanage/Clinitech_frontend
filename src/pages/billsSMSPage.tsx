// SMSPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from '@mui/material';
import {
  addSubBill,
  getHospitalServices,
  getTreatments,
  getPatientBill,
  createSMSRecord,
} from '../services/api';

interface ServiceOption {
  id: string;
  name: string;
  price: number;
}

interface SubBill {
  _id: string;
  dailyAmount: number;
  createdAt: string;
}

interface Bill {
  _id: string;
  patientId: string;
  subBills: SubBill[];
  finalAmount: number;
  insuranceCoverage: number;
  isCheckedOut: boolean;
  createdAt: string;
}

interface SMSPageProps {
  searchPatientId: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SMSPage: React.FC<SMSPageProps> = () => {
  const [patientId, setPatientId] = useState('');
  const [hospitalServicesOptions, setHospitalServicesOptions] = useState<ServiceOption[]>([]);
  const [treatmentsOptions, setTreatmentsOptions] = useState<ServiceOption[]>([]);
  const [selectedHospitalServices, setSelectedHospitalServices] = useState<string[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bill, setBill] = useState<Bill | null>(null);
  const [isFetchingBill, setIsFetchingBill] = useState(false);

  // Fetch hospital services and treatments
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const servicesResponse = await getHospitalServices();
        if (servicesResponse.success) {
          setHospitalServicesOptions(servicesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching hospital services:', error);
      }

      try {
        const treatmentsResponse = await getTreatments();
        if (treatmentsResponse.success) {
          setTreatmentsOptions(treatmentsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching treatments:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleHospitalServicesChange = (event: any) => {
    const { target: { value } } = event;
    setSelectedHospitalServices(typeof value === 'string' ? value.split(',') : value);
  };

  const handleTreatmentsChange = (event: any) => {
    const { target: { value } } = event;
    setSelectedTreatments(typeof value === 'string' ? value.split(',') : value);
  };

  // Compute the total daily bill from selected services and treatments
  const computedDailyBill = useMemo(() => {
    const servicesTotal = selectedHospitalServices.reduce((sum, serviceName) => {
      const option = hospitalServicesOptions.find((o) => o.name === serviceName);
      return sum + (option ? option.price : 0);
    }, 0);
    const treatmentsTotal = selectedTreatments.reduce((sum, treatmentName) => {
      const option = treatmentsOptions.find((o) => o.name === treatmentName);
      return sum + (option ? option.price : 0);
    }, 0);
    return servicesTotal + treatmentsTotal;
  }, [selectedHospitalServices, selectedTreatments, hospitalServicesOptions, treatmentsOptions]);

  // Fetch bill on patient ID change to update UI
  const fetchBillForPatient = async (id: string) => {
    try {
      const response = await getPatientBill(id);
      if (response.success) {
        setBill(response.data);
      } else {
        setBill(null);
      }
    } catch (error) {
      console.error('Error fetching bill:', error);
      setBill(null);
    }
  };

  // When patientId changes, update the fetched bill
  useEffect(() => {
    if (patientId) {
      fetchBillForPatient(patientId);
    } else {
      setBill(null);
    }
  }, [patientId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Prevent submission if neither a service nor a treatment is selected.
    if (selectedHospitalServices.length === 0 && selectedTreatments.length === 0) {
      alert('Please select at least one hospital service or treatment.');
      return;
    }

    // If the fetched bill exists and is checked out, do not allow new submissions.
    if (bill && bill.isCheckedOut) {
      alert('Patient is already checked out. Cannot create new bill.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the bill using the computed daily bill
      const response = await addSubBill(
        patientId,
        computedDailyBill,
        selectedHospitalServices,
        selectedTreatments
      );

      if (response.data.success) {
        const createdBill = response.data.data;

        // Build an SMS template message
        const smsTemplate = `Dear Patient, your bill (ID: ${createdBill._id}) has been generated with a total amount of Rs.${createdBill.finalAmount}.`;

        // Create the SMS record
        await createSMSRecord(patientId, createdBill._id, smsTemplate);

        alert('Bill created successfully and SMS record created!');
        setPatientId('');
        setSelectedHospitalServices([]);
        setSelectedTreatments([]);
        setBill(createdBill);
      } else {
        alert('Bill creation failed!');
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Error creating bill.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetchBill = async () => {
    if (!patientId) {
      alert('Please enter a Patient ID to fetch bill');
      return;
    }
    setIsFetchingBill(true);
    try {
      const response = await getPatientBill(patientId);
      if (response.success) {
        setBill(response.data);
      } else {
        alert('Bill not found');
      }
    } catch (error) {
      console.error('Error fetching bill:', error);
      alert('Error fetching bill.');
    } finally {
      setIsFetchingBill(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Bills & SMS Management
      </Typography>
      <Card sx={{ mt: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Create Bill
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Patient ID"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              {/* Display Computed Daily Bill */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Total Daily Bill"
                  value={computedDailyBill}
                  fullWidth
                  disabled
                />
              </Grid>
              {/* Hospital Services Dropdown */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="hospital-services-label">Hospital Services</InputLabel>
                  <Select
                    labelId="hospital-services-label"
                    multiple
                    value={selectedHospitalServices}
                    onChange={handleHospitalServicesChange}
                    input={<OutlinedInput label="Hospital Services" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const option = hospitalServicesOptions.find((o) => o.name === value);
                          return (
                            <Chip key={value} label={`${value} ($${option ? option.price : ''})`} />
                          );
                        })}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {hospitalServicesOptions.map((service) => (
                      <MenuItem key={service.id} value={service.name}>
                        {service.name} - ${service.price}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Treatments Dropdown */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="treatments-label">Treatments</InputLabel>
                  <Select
                    labelId="treatments-label"
                    multiple
                    value={selectedTreatments}
                    onChange={handleTreatmentsChange}
                    input={<OutlinedInput label="Treatments" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const option = treatmentsOptions.find((o) => o.name === value);
                          return (
                            <Chip key={value} label={`${value} ($${option ? option.price : ''})`} />
                          );
                        })}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {treatmentsOptions.map((treatment) => (
                      <MenuItem key={treatment.id} value={treatment.name}>
                        {treatment.name} - ${treatment.price}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    isSubmitting ||
                    (selectedHospitalServices.length === 0 && selectedTreatments.length === 0) ||
                    (bill && bill.isCheckedOut)
                  }
                >
                  {bill && bill.isCheckedOut
                    ? 'Checked Out'
                    : isSubmitting
                    ? 'Creating...'
                    : 'Create Bill'}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" onClick={handleFetchBill} disabled={isFetchingBill}>
                  {isFetchingBill ? 'Fetching Bill...' : 'Fetch Bill'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Bill Display Table */}
      {bill && (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient ID</TableCell>
                <TableCell>Main Bill ID</TableCell>
                <TableCell>Final Amount</TableCell>
                <TableCell>Insurance Coverage</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{bill.patientId}</TableCell>
                <TableCell>{bill._id}</TableCell>
                <TableCell>{bill.finalAmount}</TableCell>
                <TableCell>{bill.insuranceCoverage}</TableCell>
                <TableCell>{new Date(bill.createdAt).toLocaleString()}</TableCell>
              </TableRow>
              {bill.subBills.map((subBill) => (
                <TableRow key={subBill._id}>
                  <TableCell colSpan={2} sx={{ pl: 4 }}>
                    Sub-Bill ID: {subBill._id}
                  </TableCell>
                  <TableCell>Amount: {subBill.dailyAmount}</TableCell>
                  <TableCell colSpan={2}>
                    Created: {new Date(subBill.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default SMSPage;
