// PatientPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  Box,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import TodayIcon from '@mui/icons-material/Today';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import { checkoutPatient, getPatientBill } from '../services/api';

interface Bill {
  isCheckedOut: boolean;
  createdAt: string;
  finalAmount: number;
  insuranceCoverage: number;
}

interface Patient {
  _id: string;
  fullName: string;
  NIC: string;
  address: string;
  DOB: string;
  contactNumber: string;
  email: string;
}

interface PatientPageProps {
  searchPatientId: string;
  patientSearchResult: Patient | null;
  updatePatientData?: (patient: Patient & { bill: Bill }) => void;
}

const PatientPage: React.FC<PatientPageProps> = ({
  searchPatientId,
  patientSearchResult,
  updatePatientData,
}) => {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [totalBill, setTotalBill] = useState<number>(0);
  const [insuranceCoverage, setInsuranceCoverage] = useState<string>('0');
  const [billDetails, setBillDetails] = useState<Bill | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch the bill when patientSearchResult is available.
  useEffect(() => {
    const fetchBill = async () => {
      if (patientSearchResult) {
        try {
          const response = await getPatientBill(patientSearchResult._id);
          if (response.success) {
            const bill: Bill = response.data;
            setTotalBill(bill.finalAmount);
            setInsuranceCoverage(bill.insuranceCoverage.toString());
            setBillDetails(bill);
            if (updatePatientData) {
              updatePatientData({ ...patientSearchResult, bill });
            }
          }
        } catch (error) {
          console.error("Error fetching bill:", error);
        }
      }
    };
    fetchBill();
  }, [patientSearchResult, updatePatientData]);

  // Calculate the amount due: finalAmount - insuranceCoverage.
  const amountDue = totalBill - (parseFloat(insuranceCoverage) || 0);

  // Format date strings.
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Show the checkout form (if not already visible).
  const handleCheckoutClick = () => {
    setShowCheckoutForm(true);
  };

  // Save checkout and update the bill details.
  const handleSaveCheckout = async () => {
    if (!patientSearchResult) return;
    setIsSaving(true);
    try {
      const response = await checkoutPatient(
        patientSearchResult._id,
        insuranceCoverage,
        amountDue < 0 ? 0 : amountDue
      );
      if (response.success) {
        const updatedBill: Bill = response.data;
        setTotalBill(updatedBill.finalAmount);
        setInsuranceCoverage(updatedBill.insuranceCoverage.toString());
        setBillDetails(updatedBill);
        if (updatePatientData) {
          updatePatientData({ ...patientSearchResult, bill: updatedBill });
        }
        alert("Checkout saved successfully!");
      } else {
        alert("Checkout failed");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred while saving checkout.");
    } finally {
      setIsSaving(false);
      // Do not hide the form; leave it visible.
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, px: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        Patient Record
      </Typography>

      {searchPatientId && patientSearchResult ? (
        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <AccountCircleIcon fontSize="large" />
                </Avatar>
              </Grid>
              <Grid item>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                  {patientSearchResult.fullName}
                </Typography>
              </Grid>
            </Grid>

            <List sx={{ mt: 2 }}>
              <ListItem>
                <ListItemIcon>
                  <FingerprintIcon />
                </ListItemIcon>
                <ListItemText primary="Patient ID" secondary={patientSearchResult._id} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FingerprintIcon />
                </ListItemIcon>
                <ListItemText primary="NIC" secondary={patientSearchResult.NIC} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TodayIcon />
                </ListItemIcon>
                <ListItemText primary="Date of Birth" secondary={formatDate(patientSearchResult.DOB)} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Address" secondary={patientSearchResult.address} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText primary="Contact" secondary={patientSearchResult.contactNumber} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={patientSearchResult.email} />
              </ListItem>
              {billDetails && (
                <ListItem>
                  <ListItemIcon>
                    <TodayIcon />
                  </ListItemIcon>
                  <ListItemText primary="Bill Created On" secondary={formatDate(billDetails.createdAt)} />
                </ListItem>
              )}
            </List>
            <Box sx={{ mt: 3 }}>
              {billDetails && billDetails.isCheckedOut ? (
                <Button variant="contained" color="success" disabled>
                  Checked Out
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleCheckoutClick}>
                  Checkout
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        !searchPatientId ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60vh',
            }}
          >
            <SearchIcon sx={{ fontSize: 120, opacity: 0.6, color: 'text.secondary' }} />
            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
              Please search for a patient by ID.
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            No patient found with that ID.
          </Typography>
        )
      )}

      {(showCheckoutForm || billDetails?.isCheckedOut) && (
        <Card sx={{ mb: 8, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Checkout Details
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Total Bill Amount"
                  value={totalBill}
                  InputProps={{ startAdornment: <ReceiptIcon sx={{ mr: 1 }} /> }}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Insurance Coverage"
                  value={insuranceCoverage}
                  onChange={(e) => setInsuranceCoverage(e.target.value)}
                  fullWidth
                  disabled={billDetails?.isCheckedOut ?? false}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Amount Due"
                  value={amountDue < 0 ? 0 : amountDue}
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveCheckout}
                disabled={isSaving || (billDetails?.isCheckedOut ?? false)}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default PatientPage;
