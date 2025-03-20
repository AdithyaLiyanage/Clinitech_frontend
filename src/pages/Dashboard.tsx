import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import SmsIcon from '@mui/icons-material/Sms';
import SearchIcon from "@mui/icons-material/Search";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import {
  DashboardLayout,
  type SidebarFooterProps,
} from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { Avatar } from "@mui/material";
import PatientPage from "./PatientPage";
import SMSPage  from "./SMSPage";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "patients",
    title: "Patients",
    icon: <PeopleIcon />,
  },
  {
    segment: 'sms',
    title: 'SMS',
    icon: <SmsIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }: { pathname: string }) {
  switch (pathname) {
    case "/patients":
      return <PatientPage />;
    case "/sms":
      return <SMSPage />;
    default:
      return (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography>Page not found</Typography>
        </Box>
      );
  }
}

function ToolbarActionsSearch() {
  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              display: { xs: "inline", md: "none" },
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
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

function SidebarFooter({ mini }: SidebarFooterProps) {
  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: "nowrap", overflow: "hidden" }}
    >
      {mini ? "© MUI" : `© ${new Date().getFullYear()} Made with love by MUI`}
    </Typography>
  );
}

function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar
        src="../assets/logo.png"
        alt="CliniTech Logo"
        sx={{ width: 40, height: 40 }}
      />
      <Typography variant="h6">CliniTech</Typography>
    </Stack>
  );
}

export default function DashboardLayoutSlots() {
  const router = useDemoRouter("/patients");

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
      <DashboardLayout
        slots={{
          appTitle: CustomAppTitle,
          toolbarActions: ToolbarActionsSearch,
          sidebarFooter: SidebarFooter,
        }}
      >
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}
