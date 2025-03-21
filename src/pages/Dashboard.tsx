import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import SmsIcon from "@mui/icons-material/Sms";
import SearchIcon from "@mui/icons-material/Search";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import Logo  from "../assets/logo.png";
import React, { useState } from "react";
import PatientPage from "./PatientPage";
import SMSPage from "./billsSMSPage";
import { getPatientById } from "../services/api";
import { PatientData } from "../types/patientData";

const NAVIGATION = [
  {
    kind: "page",
    segment: "patients",
    title: "Patient Record",
    icon: <PeopleIcon />,
  },
  {
    kind: "page",
    segment: "sms",
    title: "Bills & SMS",
    icon: <SmsIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: { colorSchemeSelector: "data-toolpad-color-scheme" },
  palette: { mode: 'light' },
  breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
});

function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <img src={Logo} alt="CliniTech Logo" style={{ width: 40, height: 40 }} />
      <Typography variant="h6">CliniTech</Typography>
    </Stack>
  );
}

function ToolbarActionsSearch({ onSearch }: { onSearch: (value: string) => void }) {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchValue);
  };

  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{ display: { xs: "inline", md: "none" } }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Patient ID"
        value={searchValue}
        onChange={handleInputChange}
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small" onClick={handleSearchClick}>
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{ display: { xs: "none", md: "inline-block" }, mr: 1 }}
      />
    </Stack>
  );
}

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
  bill: Bill;
}

interface DemoPageContentProps {
  pathname: string;
  searchPatientId: string;
  patientSearchResult: Patient | null;
}

function DemoPageContent({ pathname, searchPatientId, patientSearchResult }: DemoPageContentProps) {
  switch (pathname) {
    case "/patients":
      return <PatientPage searchPatientId={searchPatientId} patientSearchResult={patientSearchResult} />;
    case "/sms":
      return <SMSPage searchPatientId={searchPatientId} />;
    default:
      return (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography>Page not found</Typography>
        </Box>
      );
  }
}

export default function DashboardLayoutSlots() {
  const router = useDemoRouter("/patients");
  const [searchPatientId, setSearchPatientId] = useState("");
  const [patientSearchResult, setPatientSearchResult] = useState<Patient | null>(null);

  const handleSearch = async (id: string) => {
    setSearchPatientId(id);
    if (router.pathname === "/patients") {
      try {
        const response = await getPatientById(id);
        const data: PatientData = response.data.data;
        // Augment the API result with a default bill property.
        const patientWithBill: Patient = {
          ...data,
          bill: {
            isCheckedOut: false,
            createdAt: new Date().toISOString(),
            finalAmount: 0,
            insuranceCoverage: 0,
          },
        };
        setPatientSearchResult(patientWithBill);
      } catch (error) {
        console.error("Patient not found", error);
        setPatientSearchResult(null);
      }
    }
  };

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
      <DashboardLayout
        slots={{
          appTitle: CustomAppTitle,
          toolbarActions: () =>
            router.pathname === "/patients" ? (
              <ToolbarActionsSearch onSearch={handleSearch} />
            ) : null,
        }}
      >
        <DemoPageContent
          pathname={router.pathname}
          searchPatientId={searchPatientId}
          patientSearchResult={patientSearchResult}
        />
      </DashboardLayout>
    </AppProvider>
  );
}


