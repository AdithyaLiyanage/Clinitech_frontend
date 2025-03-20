// SMSPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

interface SMSData {
  phone: string;
  billAmount: string;
  consultationDate: string;
  dateToSend: string;
  message: string;
}

const SMSPage: React.FC = () => {
  // The SMS currently being composed or edited
  const [smsData, setSmsData] = useState<SMSData>({
    phone: '',
    billAmount: '',
    consultationDate: '',
    dateToSend: '',
    message: '',
  });

  // A list of scheduled/previously "sent" SMS
  const [smsList, setSmsList] = useState<SMSData[]>([]);

  // Keep track of which SMS we’re editing (if any). -1 means we're creating a new one
  const [editIndex, setEditIndex] = useState<number>(-1);

  // Read ClickSend credentials from environment variables via Vite
  // Note: They must be prefixed with VITE_ in your .env file
  const username = import.meta.env.VITE_CLICKSEND_USERNAME || '';
  const apiKey = import.meta.env.VITE_CLICKSEND_API_KEY || '';

  /**
   * Helper function to send SMS via ClickSend
   */
  const sendSMSViaClickSend = async (phone: string, message: string) => {
    try {
      const response = await axios.post(
        'https://rest.clicksend.com/v3/sms/send',
        {
          messages: [
            {
              source: 'sdk',
              from: 'YourSenderID', // Must be a valid "from" number or sender ID in your ClickSend account
              body: message,
              to: phone,
            },
          ],
        },
        {
          auth: {
            username,
            password: apiKey,
          },
        }
      );
      console.log('SMS sent successfully:', response.data);
      // In a real app, you might show a toast/snackbar to the user, or handle errors more robustly.
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };

  // Automatically set the dateToSend to the day after the consultationDate
  useEffect(() => {
    if (smsData.consultationDate) {
      const date = new Date(smsData.consultationDate);
      date.setDate(date.getDate() + 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const nextDayString = `${year}-${month}-${day}`;
      setSmsData((prev) => ({ ...prev, dateToSend: nextDayString }));
    }
  }, [smsData.consultationDate]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSmsData((prev) => ({ ...prev, [name]: value }));
  };

  // "Send" or update an SMS
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If editIndex is -1, we are creating a new SMS
    if (editIndex === -1) {
      setSmsList((prev) => [...prev, smsData]);
    } else {
      // Otherwise, update the existing SMS in the list
      const updatedList = [...smsList];
      updatedList[editIndex] = smsData;
      setSmsList(updatedList);
      setEditIndex(-1);
    }

    // Attempt to send (or resend) the SMS via ClickSend
    // (In a real production scenario, you might do this on the server instead.)
    await sendSMSViaClickSend(smsData.phone, smsData.message);

    // Clear the form
    setSmsData({
      phone: '',
      billAmount: '',
      consultationDate: '',
      dateToSend: '',
      message: '',
    });
  };

  // Edit an existing SMS
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setSmsData(smsList[index]);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        SMS Management
      </Typography>

      {/* Form to create or edit an SMS */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editIndex === -1 ? 'Send a New SMS' : 'Edit and Resend SMS'}
        </Typography>
        <Grid container spacing={2}>
          {/* Phone Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              name="phone"
              value={smsData.phone}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          {/* Bill Amount */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Bill Amount"
              name="billAmount"
              value={smsData.billAmount}
              onChange={handleChange}
              type="number"
              fullWidth
              required
            />
          </Grid>
          {/* Consultation Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Consultation Date"
              name="consultationDate"
              type="date"
              value={smsData.consultationDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          {/* Date to Send (auto-populated to next day, but user can adjust if needed) */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date to Send"
              name="dateToSend"
              type="date"
              value={smsData.dateToSend}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          {/* Message Text */}
          <Grid item xs={12}>
            <TextField
              label="Message"
              name="message"
              value={smsData.message}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              required
            />
          </Grid>
          {/* Submit button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {editIndex === -1 ? 'Send SMS' : 'Update & Resend'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Table listing sent/scheduled SMS */}
      <Typography variant="h6" gutterBottom>
        Scheduled / Sent SMS
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="sms table">
          <TableHead>
            <TableRow>
              <TableCell>Phone</TableCell>
              <TableCell>Bill Amount</TableCell>
              <TableCell>Consultation Date</TableCell>
              <TableCell>Date to Send</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {smsList.map((sms, index) => (
              <TableRow key={index}>
                <TableCell>{sms.phone}</TableCell>
                <TableCell>{sms.billAmount}</TableCell>
                <TableCell>{sms.consultationDate}</TableCell>
                <TableCell>{sms.dateToSend}</TableCell>
                <TableCell>{sms.message}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(index)}>
                    Modify & Resend
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {smsList.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No SMS scheduled yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SMSPage;
