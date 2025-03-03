import { useState, useEffect } from "react";
import {Box, Button,Typography, Container, IconButton, InputAdornment, MenuItem, Paper} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { Visibility, VisibilityOff, Save, AddCircleOutline } from "@mui/icons-material";
import HelpTextField from "../../HelpTextField/HelpTextField.tsx";

// Styled container matching your styling guide
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "30px",
  borderRadius: "12px",
  backdropFilter: "blur(24px)",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  fontFamily: "monospace",
}));

// Styled Select for a consistent gray/white look
import { Select } from "@mui/material";
const StyledSelect = styled(Select)(({ theme }) => ({
  marginBottom: "15px",
  backgroundColor: "gray",
  color: "white",
  borderRadius: "5px",
  fontFamily: "monospace",

  // Ensure the dropdown arrow is also white
  "& .MuiSvgIcon-root": {
    color: "white",
  },

  // Outline styling
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
}));

const DatabaseSetup = () => {
  // We store the list of known database names in state
  const [databaseNames, setDatabaseNames] = useState<string[]>([]);
  // Currently chosen DB from dropdown
  const [selectedDatabase, setSelectedDatabase] = useState("");
  // Database connection fields
  const [host, setHost] = useState("");
  const [port, setPort] = useState("5432");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState("");
  // For toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // --------------------------------------------------
  // Helper: Load the entire db_list from localStorage
  // as an object keyed by database name
  // --------------------------------------------------
  const loadAllDbConfigs = (): Record<string, any> => {
    const stored = localStorage.getItem("db_list");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // If not an object (for example, an old array), convert or reset
        return typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
      } catch (err) {
        console.error("Error parsing db_list:", err);
      }
    }
    return {};
  };

  // On initial render, populate dropdown from localStorage
  // and load the "last-used" database if present
  useEffect(() => {
    const allDbConfigs = loadAllDbConfigs();
    setDatabaseNames(Object.keys(allDbConfigs));

    const lastLoaded = localStorage.getItem("db_settings");
    if (lastLoaded) {
      try {
        const parsedSettings = JSON.parse(lastLoaded);
        setSelectedDatabase(parsedSettings.database || "");
        setHost(parsedSettings.host || "");
        setPort(parsedSettings.port || "5432");
        setUsername(parsedSettings.username || "");
        setDatabase(parsedSettings.database || "");
        setPassword(parsedSettings.password || "");
      } catch (error) {
        console.error("Error loading last-used settings:", error);
      }
    }
  }, []);

  // --------------------------------------------------
  // Handle user choosing a DB from the dropdown
  // --------------------------------------------------
  const handleDatabaseChange = (event: any) => {
    const selectedDb = event.target.value;
    setSelectedDatabase(selectedDb);

    if (selectedDb === "new") {
      // Clear fields for brand new DB
      setHost("");
      setPort("5432");
      setUsername("");
      setDatabase("");
      setPassword("");
      return;
    }

    // If an existing DB name is chosen, load its fields
    const allDbConfigs = loadAllDbConfigs();
    if (allDbConfigs[selectedDb]) {
      const { host, port, username, password } = allDbConfigs[selectedDb];
      // The DB name is the key (i.e. selectedDb)
      setHost(host);
      setPort(port);
      setUsername(username);
      setDatabase(selectedDb);
      setPassword(password);
    }
  };

  // --------------------------------------------------
  // Handle saving (storing/updating) DB config
  // --------------------------------------------------
  const handleSave = () => {
    // If the user hasn't provided a database name, stop
    if (!database.trim()) {
      alert("Please enter a Database Name before saving.");
      return;
    }

    // Read the entire DB config object
    let allDbConfigs = loadAllDbConfigs();
    // Overwrite or create the entry
    allDbConfigs[database] = { host, port, username, password };

    // Write it back to localStorage
    localStorage.setItem("db_list", JSON.stringify(allDbConfigs));

    // Also set the last-used config
    localStorage.setItem(
      "db_settings",
      JSON.stringify({ host, port, username, password, database })
    );

    // Refresh the dropdown list
    setDatabaseNames(Object.keys(allDbConfigs));
    // Mark the DB as selected in the dropdown
    setSelectedDatabase(database);

    alert("Database settings saved!");
  };

  // Additional props for toggling password visibility
  const passwordInputProps = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
          {showPassword ? <VisibilityOff sx={{ color: "white" }} /> : <Visibility sx={{ color: "white" }} />}
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <StyledPaper elevation={6}>
        <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
          Database Connection Setup
        </Typography>

        {/* Dropdown for picking an existing database OR add new */}
        <StyledSelect
          value={selectedDatabase}
          onChange={handleDatabaseChange}
          fullWidth
          variant="outlined"
        >
          {databaseNames.map((db) => (
            <MenuItem key={db} value={db}>
              {db}
            </MenuItem>
          ))}
          {/* 'Add New Database' item */}
          <MenuItem value="new">
            <AddCircleOutline sx={{ marginRight: "8px" }} />
            Add New Database
          </MenuItem>
        </StyledSelect>

        {/* These fields are always visible, showing the info for the
            selected or new DB */}
        <HelpTextField
          label="Host"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          tooltipText="Enter the hostname or IP address of the PostgreSQL server."
        />
        <HelpTextField
          label="Port"
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          tooltipText="Enter the port number for the PostgreSQL server (default: 5432)."
        />
        <HelpTextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          tooltipText="Enter the database username."
        />
        <HelpTextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          tooltipText="Enter the database password."
          inputProps={passwordInputProps}
        />
        <HelpTextField
          label="Database Name"
          value={database}
          onChange={(e) => setDatabase(e.target.value)}
          tooltipText="Enter the name of the database you want to connect to."
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            marginTop: "20px",
            backgroundColor: "darkgray",
            fontFamily: "monospace",
            fontWeight: "bold",
          }}
          onClick={handleSave}
          startIcon={<Save />}
        >
          Save Database Settings
        </Button>
      </StyledPaper>
    </Container>
  );
};

export default DatabaseSetup;
