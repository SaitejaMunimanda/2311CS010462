import { CssBaseline, ThemeProvider, createTheme, Box, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { NotificationsPage } from "./pages/NotificationsPage";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1565C0",
      dark: "#0D47A1",
    },
    secondary: {
      main: "#7B1FA2",
    },
    background: {
      default: "#EEF2FF",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
  },
  shape: {
    borderRadius: 10,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
          px: { xs: 1, sm: 3 },
          py: 4,
        }}
      >
        {/* Top Banner */}
        <Box
          sx={{
            maxWidth: 720,
            mx: "auto",
            mb: 3,
            background: "linear-gradient(90deg, #1565C0 0%, #7B1FA2 100%)",
            borderRadius: "16px",
            px: 4,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
            boxShadow: "0 8px 24px rgba(21, 101, 192, 0.35)",
          }}
        >
          <NotificationsIcon sx={{ color: "white", fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight={800} color="white" sx={{ letterSpacing: "-0.5px" }}>
              Campus Notification System
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.8)">
              Stay up-to-date with Placements, Results &amp; Events
            </Typography>
          </Box>
        </Box>

        <NotificationsPage />
      </Box>
    </ThemeProvider>
  );
}

export default App;