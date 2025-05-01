import React, { useState, useEffect, useMemo } from "react";
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
  Stack,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  addSubBill,
  getHospitalServices,
  getTreatments,
  getPatientBill,
  createSMSRecord,
  deleteBill,
  deleteSubBill,
  editBill,
  editSubBill,
} from "../services/api";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GenerateReport from "../utils/GenerateReport.tsx";

interface ServiceOption {
  id: string;
  name: string;
  price: number;
}

interface SubBill {
  hospitalServices: any;
  treatments: any;
  _id: string;
  dailyAmount: number;
  createdAt: string;
}

interface Bill {
  treatments: boolean;
  hospitalServices: boolean;
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
  const [patientId, setPatientId] = useState("");
  const [hospitalServicesOptions, setHospitalServicesOptions] = useState<
    ServiceOption[]
  >([]);
  const [treatmentsOptions, setTreatmentsOptions] = useState<ServiceOption[]>(
    []
  );
  const [selectedHospitalServices, setSelectedHospitalServices] = useState<
    string[]
  >([]);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bill, setBill] = useState<Bill | null>(null);
  const [isFetchingBill, setIsFetchingBill] = useState(false);
  const [editingSub, setEditingSub] = useState<SubBill | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editServices, setEditServices] = useState<string[]>([]);
  const [editTreatments, setEditTreatments] = useState<string[]>([]);

  // Fetch hospital services and treatments
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const servicesResponse = await getHospitalServices();
        if (servicesResponse.success) {
          setHospitalServicesOptions(servicesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching hospital services:", error);
      }

      try {
        const treatmentsResponse = await getTreatments();
        if (treatmentsResponse.success) {
          setTreatmentsOptions(treatmentsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching treatments:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleHospitalServicesChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSelectedHospitalServices(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleTreatmentsChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSelectedTreatments(typeof value === "string" ? value.split(",") : value);
  };

  // Compute the total daily bill from selected services and treatments
  const computedDailyBill = useMemo(() => {
    const servicesTotal = selectedHospitalServices.reduce(
      (sum, serviceName) => {
        const option = hospitalServicesOptions.find(
          (o) => o.name === serviceName
        );
        return sum + (option ? option.price : 0);
      },
      0
    );
    const treatmentsTotal = selectedTreatments.reduce((sum, treatmentName) => {
      const option = treatmentsOptions.find((o) => o.name === treatmentName);
      return sum + (option ? option.price : 0);
    }, 0);
    return servicesTotal + treatmentsTotal;
  }, [
    selectedHospitalServices,
    selectedTreatments,
    hospitalServicesOptions,
    treatmentsOptions,
  ]);

  // Fetch bill on patient ID change to update UI
  const fetchBillForPatient = async (id: string) => {
    try {
      const response = await getPatientBill(id);
      if (response.success) {
        setBill(response.data);
        console.log("Fetched bill:", response.data);
      } else {
        setBill(null);
      }
    } catch (error) {
      console.error("Error fetching bill:", error);
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
    if (
      selectedHospitalServices.length === 0 &&
      selectedTreatments.length === 0
    ) {
      alert("Please select at least one hospital service or treatment.");
      return;
    }

    // If the fetched bill exists and is checked out, do not allow new submissions.
    if (bill && bill.isCheckedOut) {
      alert("Patient is already checked out. Cannot create new bill.");
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

        alert("Bill created successfully");
        setPatientId("");
        setSelectedHospitalServices([]);
        setSelectedTreatments([]);
        setBill(createdBill);
      } else {
        alert("Bill creation failed!");
      }
    } catch (error) {
      console.error("Error creating bill:", error);
      alert("Error creating bill.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetchBill = async () => {
    if (!patientId) {
      alert("Please enter a Patient ID to fetch bill");
      return;
    }
    setIsFetchingBill(true);
    try {
      const response = await getPatientBill(patientId);
      if (response.success) {
        setBill(response.data);
      } else {
        alert("Bill not found");
      }
    } catch (error) {
      console.error("Error fetching bill:", error);
      alert("Error fetching bill.");
    } finally {
      setIsFetchingBill(false);
    }
  };

  const handleEditMainBill = async () => {
    if (!bill) return;
    const newCov = window.prompt(
      "Enter new insurance coverage amount:",
      bill.insuranceCoverage.toString()
    );
    if (newCov == null) return;
    const parsed = parseFloat(newCov);
    if (isNaN(parsed)) {
      alert("Invalid number");
      return;
    }
    try {
      const resp = await editBill(bill._id, { insuranceCoverage: parsed });
      if (resp.success) setBill(resp.data);
    } catch (e) {
      console.error(e);
      alert("Failed to update bill");
    }
  };

  const handleDeleteMainBill = async () => {
    if (!bill) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this entire bill (all sub-bills)?"
      )
    )
      return;
    try {
      const resp = await deleteBill(bill._id);
      if (resp.success) {
        setBill(null);
        alert("Bill deleted");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to delete bill");
    }
  };

  const handleEditSub = (subBill: SubBill) => {
    setEditingSub(subBill);
    setEditAmount(subBill.dailyAmount);
    setEditServices(subBill.hospitalServices);
    setEditTreatments(subBill.treatments);
  };

  const handleSaveSub = async () => {
    if (!editingSub || !bill) return;
    try {
      const resp = await editSubBill(bill._id, editingSub._id, {
        dailyAmount: editAmount,
        hospitalServices: editServices,
        treatments: editTreatments,
      });
      if (resp.success) setBill(resp.data);
      setEditingSub(null);
    } catch (e) {
      console.error(e);
      alert("Failed to update sub-bill");
    }
  };

  const handleDeleteSub = async (subBill: SubBill) => {
    if (
      !window.confirm(
        `Delete sub-bill ${subBill._id} of amount ${subBill.dailyAmount}?`
      )
    )
      return;
    try {
      const resp = await deleteSubBill(bill!._id, subBill._id);
      if (resp.success) setBill(resp.data);
    } catch (e) {
      console.error(e);
      alert("Failed to delete sub-bill");
    }
  };

  const handleSendSMS = async (sub: SubBill) => {
    setIsSubmitting(true)
    try {
      const sentDate       = new Date()
      const formattedDate  = sentDate.toLocaleString()
      const dailyFormatted = sub.dailyAmount.toLocaleString()
 
      const smsTemplate = `
        Dear Patient, your bill (ID: ${bill!._id}) has been generated with a total amount of Rs.${bill!.finalAmount} on ${formattedDate}.
        For sub-bill ID ${sub._id} (${sub.hospitalServices.join(", ")}), the daily amount is Rs.${dailyFormatted}.
      `.trim()
 
      console.log("SMS Template:", smsTemplate)
 
      const response = await createSMSRecord(patientId, bill!._id, smsTemplate)
      if (response.data.success) {
        alert("SMS sent!")
      } else {
        alert(`Failed to send SMS: ${response.data.error || "Unknown error"}`)
      }
    } catch (err: any) {
      alert(`Error sending SMS: ${err.message || err}`)
    } finally {
      setIsSubmitting(false)
    }
  }
 
  return (
    <Container maxWidth="lg" sx={{ mt: 4, px: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Bills&nbsp;&amp;&nbsp;SMS&nbsp;Management
        </Typography>

        <GenerateReport bill={bill} />
      </Box>
      <Card sx={{ mt: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Create Bill
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
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
                  <InputLabel id="hospital-services-label">
                    Hospital Services
                  </InputLabel>
                  <Select
                    labelId="hospital-services-label"
                    multiple
                    value={selectedHospitalServices}
                    onChange={handleHospitalServicesChange}
                    input={<OutlinedInput label="Hospital Services" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const option = hospitalServicesOptions.find(
                            (o) => o.name === value
                          );
                          return (
                            <Chip
                              key={value}
                              label={`${value} ($${option ? option.price : ""})`}
                            />
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
                  <InputLabel id="treatments-label">Treatment</InputLabel>
                  <Select
                    labelId="treatments-label"
                    multiple
                    value={selectedTreatments}
                    onChange={handleTreatmentsChange}
                    input={<OutlinedInput label="Treatments" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const option = treatmentsOptions.find(
                            (o) => o.name === value
                          );
                          return (
                            <Chip
                              key={value}
                              label={`${value} ($${option ? option.price : ""})`}
                            />
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
                    (selectedHospitalServices.length === 0 &&
                      selectedTreatments.length === 0) ||
                    (bill && bill.isCheckedOut)
                  }
                >
                  {bill && bill.isCheckedOut
                    ? "Checked Out"
                    : isSubmitting
                      ? "Creating..."
                      : "Create Bill"}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={handleFetchBill}
                  disabled={isFetchingBill}
                >
                  {isFetchingBill ? "Fetching Bill..." : "Fetch Bill"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {bill && (
        <div style={{ marginBottom: "40px" }}>
          <Typography variant="subtitle1" sx={{ mt: 4 }}>
            Patient&nbsp;ID:&nbsp;<b>{bill.patientId}</b>
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell align="right">Amount&nbsp;(Rs)</TableCell>
                  <TableCell align="right">Insurance&nbsp;(%)</TableCell>
                  <TableCell>Hospital&nbsp;Services</TableCell>
                  <TableCell>Treatments</TableCell>
                  <TableCell>Created&nbsp;At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow
                  sx={{
                    bgcolor: (theme) => theme.palette.grey,
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.info.main + "22",
                    },
                    "& td, & th": { fontWeight: 600 },
                  }}
                >
                  <TableCell>{bill._id}</TableCell>
                  <TableCell>Main</TableCell>
                  <TableCell align="right">
                    {bill.finalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {bill.insuranceCoverage?.toFixed(2) ?? "—"}
                  </TableCell>
                  <TableCell sx={{ color: "text.disabled" }}>—</TableCell>
                  <TableCell sx={{ color: "text.disabled" }}>—</TableCell>
                  <TableCell>
                    {new Date(bill.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={handleEditMainBill}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={handleDeleteMainBill}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>

                {bill.subBills.map((sub) => (
                  <TableRow key={sub._id}>
                    <TableCell>{sub._id}</TableCell>
                    <TableCell>Sub</TableCell>
                    <TableCell align="right">
                      {sub.dailyAmount.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">—</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {sub.hospitalServices.map((s) => (
                          <Chip
                            key={s}
                            label={s}
                            size="small"
                            color="primary"
                          />
                        ))}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {sub.treatments.map((t) => (
                          <Chip key={t} label={t} size="small" />
                        ))}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {new Date(sub.createdAt).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Button size="small" onClick={() => handleEditSub(sub)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteSub(sub)}
                      >
                        Delete
                      </Button>
                      <Button
                        size="small"
                        onClick={()=>handleSendSMS(sub)}
                        color="secondary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending…' : 'Send SMS'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog
            open={Boolean(editingSub)}
            onClose={() => setEditingSub(null)}
            fullWidth
          >
            <DialogTitle>Edit Sub-Bill</DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Daily amount (Rs)"
                value={editAmount}
                onChange={(e) => setEditAmount(parseFloat(e.target.value))}
                sx={{ mb: 3, mt: 1 }}
              />

              <Autocomplete
                multiple
                options={hospitalServicesOptions.map((o) => o.name)}
                value={editServices}
                onChange={(_, v) => setEditServices(v)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Hospital services"
                    placeholder="Select…"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      color="primary"
                    />
                  ))
                }
                sx={{ mb: 3 }}
              />

              <Autocomplete
                multiple
                options={treatmentsOptions.map((o) => o.name)}
                value={editTreatments}
                onChange={(_, v) => setEditTreatments(v)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Treatments"
                    placeholder="Select…"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                    />
                  ))
                }
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setEditingSub(null)}>Cancel</Button>
              <Button variant="contained" onClick={handleSaveSub}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Container>
  );
};

export default SMSPage;
