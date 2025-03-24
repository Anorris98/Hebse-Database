import {useEffect, useState} from "react";
// Styled Select for a consistent gray/white look
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Switch,
  Typography
} from "@mui/material";
import {alpha, styled} from "@mui/material/styles";
import {DeleteForever, Save, Visibility, VisibilityOff} from "@mui/icons-material";
import HelpTextField from "../../HelpTextField/help-text-field.tsx";

type databaseConfig = {
  host: string;
  port: string;
  username: string;
  password: string;
  isRemote: boolean;
  sshHost: string;
  sshPort: string;
  sshUser: string;
  sshKey: string;
}

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

// --------------------------------------------------
// Helper: Load the entire db_list from localStorage
// as an object keyed by database name
// --------------------------------------------------
const loadAllDatabaseConfigs = (): Record<string, databaseConfig> => {
  const stored = localStorage.getItem("db_list");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // If not an object (for example, an old array), convert or reset
      return typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      console.error("Error parsing db_list:", error);
    }
  }
  return {};
};

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
  // Whether this DB uses a remote connection
  const [isRemote, setIsRemote] = useState(false);

  // Additional SSH fields for remote connection
  const [sshHost, setSshHost] = useState("");
  const [sshPort, setSshPort] = useState("22");
  const [sshUser, setSshUser] = useState("");
  const [sshKey, setSshKey] = useState("");

  // On initial render, populate dropdown from localStorage
  // and load the "last-used" database if present
  useEffect(() => {
    const allDatabaseConfigs = loadAllDatabaseConfigs();
    setDatabaseNames(Object.keys(allDatabaseConfigs));

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
        setIsRemote(!!parsedSettings.isRemote);

        // If remote info was saved, load it
        setSshHost(parsedSettings.sshHost || "");
        setSshPort(parsedSettings.sshPort || "22");
        setSshUser(parsedSettings.sshUser || "");
        setSshKey(parsedSettings.sshKey || "");
      } catch (error) {
        console.error("Error loading last-used settings:", error);
      }
    }
  }, []);

  // --------------------------------------------------
  // Handle user choosing a DB from the dropdown
  // --------------------------------------------------
  const handleDatabaseChange = (event: SelectChangeEvent<unknown>) => {
    const selectedDatabase = event.target.value as string;
    setSelectedDatabase(selectedDatabase);

    if (selectedDatabase === "new") {
      // Clear fields for a brand-new DB
      setHost("");
      setPort("5432");
      setUsername("");
      setDatabase("");
      setPassword("");
      setIsRemote(false);

      // Clear out SSH fields
      setSshHost("");
      setSshPort("22");
      setSshUser("");
      setSshKey("");
      return;
    }

    // If an existing DB name is chosen, load its fields
    const allDatabaseConfigs = loadAllDatabaseConfigs();
    if (allDatabaseConfigs[selectedDatabase]) {
      const {
        host,
        port,
        username,
        password,
        isRemote,
        sshHost,
        sshPort,
        sshUser,
        sshKey,
      } = allDatabaseConfigs[selectedDatabase];

      setHost(host);
      setPort(port);
      setUsername(username);
      setDatabase(selectedDatabase);
      setPassword(password);
      setIsRemote(isRemote);

      // Populate SSH fields if they exist
      setSshHost(sshHost || "");
      setSshPort(sshPort || "22");
      setSshUser(sshUser || "");
      setSshKey(sshKey || "");
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
    const allDatabaseConfigs = loadAllDatabaseConfigs();

    // Overwrite or create the entry
    allDatabaseConfigs[database] = {
      host,
      port,
      username,
      password,
      isRemote,
      // SSH data
      sshHost,
      sshPort,
      sshUser,
      sshKey
    };

    // Write it back to localStorage
    localStorage.setItem("db_list", JSON.stringify(allDatabaseConfigs));

    // Also set the last-used config
    localStorage.setItem(
      "db_settings",
      JSON.stringify({
        host,
        port,
        username,
        password,
        database,
        isRemote,
        sshHost,
        sshPort,
        sshUser,
        sshKey
      })
    );

    // Refresh the dropdown list
    setDatabaseNames(Object.keys(allDatabaseConfigs));
    // Mark the DB as selected in the dropdown
    setSelectedDatabase(database);

    alert("Database settings saved!");
  };

  // --------------------------------------------------
  // Handle removing an existing database config
  // --------------------------------------------------
  const handleRemove = () => {
    if (!selectedDatabase || selectedDatabase === "new") {
      return;
    }
    const allDatabaseConfigs = loadAllDatabaseConfigs();
    // Remove the currently selected DB config
    delete allDatabaseConfigs[selectedDatabase];
    // Persist the updated object
    localStorage.setItem("db_list", JSON.stringify(allDatabaseConfigs));

    // If the removed config was also the "last-used", clear it
    const lastUsed = localStorage.getItem("db_settings");
    if (lastUsed) {
      try {
        const parsed = JSON.parse(lastUsed);
        if (parsed.database === selectedDatabase) {
          localStorage.removeItem("db_settings");
        }
      } catch (error) {
        console.error("Error clearing last-used database:", error);
      }
    }

    // Update state to reflect removal
    setDatabaseNames(Object.keys(allDatabaseConfigs));
    setSelectedDatabase("");
    setHost("");
    setPort("5432");
    setUsername("");
    setPassword("");
    setDatabase("");
    setIsRemote(false);

    // Clear remote fields
    setSshHost("");
    setSshPort("22");
    setSshUser("");
    setSshKey("");

    alert(`Database '${selectedDatabase}' was removed!`);
  };

  // Additional props for toggling password visibility
  const passwordInputProperties = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
          {showPassword ? <VisibilityOff sx={{ color: "white" }} /> : <Visibility sx={{ color: "white" }} />}
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <Box sx={{ width: "100%" }}>
      <StyledPaper elevation={6}>
        <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center", fontFamily: "monospace" , color: "white" }}>
          Database Connection Setup
        </Typography>

        {/* Dropdown for picking an existing database OR add new */}
        <StyledSelect
          value={selectedDatabase}
          onChange={handleDatabaseChange}
          fullWidth
          variant="outlined"
          sx={{
            backgroundColor: "darkgray",
            fontFamily: "monospace",
            fontWeight: "bold",
            flex: 1,
          }}
        >
          {databaseNames.map((database) => (
            <MenuItem key={database} value={database}>
              {database}
            </MenuItem>
          ))}
          {/* 'Add New Database' item */}
          <MenuItem value="new">
            Add New Database
          </MenuItem>
        </StyledSelect>

        {/* Toggle whether this is a remote DB */}
        <Box sx={{ marginBottom: "15px" }}>
          <FormControlLabel
            control={
              <Switch
                checked={isRemote}
                onChange={(input) => setIsRemote(input.target.checked)}
              />
            }
            label="Remote Database"
            sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'monospace', color: "white" } }}
          />
        </Box>

        {/* Standard DB fields */}
        <HelpTextField
          label="Host"
          value={host}
          onChange={(input) => setHost(input.target.value)}
          tooltipText="Enter the hostname or IP address of the PostgreSQL server."
        />
        <HelpTextField
          label="Port"
          type="number"
          value={port}
          onChange={(input) => setPort(input.target.value)}
          tooltipText="Enter the port number for the PostgreSQL server (default: 5432)."
        />
        <HelpTextField
          label="Username"
          value={username}
          onChange={(input) => setUsername(input.target.value)}
          tooltipText="Enter the database username."
        />
        <HelpTextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(input) => setPassword(input.target.value)}
          tooltipText="Enter the database password."
          inputProps={passwordInputProperties}
        />
        <HelpTextField
          label="Database Name"
          value={database}
          onChange={(input) => setDatabase(input.target.value)}
          tooltipText="Enter the name of the database you want to connect to."
        />

        {/* SSH/Remote-only fields */}
        {isRemote && (
          <>
            <Typography variant="h6" sx={{ marginTop: "20px", marginBottom: "10px", fontFamily: "monospace" , color: "white"}}>
              SSH Connection Details
            </Typography>
            <HelpTextField
              label="SSH Host"
              value={sshHost}
              onChange={(input) => setSshHost(input.target.value)}
              tooltipText="Enter the SSH host for tunneling (e.g., example.com)."
            />
            <HelpTextField
              label="SSH Port"
              type="number"
              value={sshPort}
              onChange={(input) => setSshPort(input.target.value)}
              tooltipText="SSH port (default 22)."
            />
            <HelpTextField
              label="SSH Username"
              value={sshUser}
              onChange={(input) => setSshUser(input.target.value)}
              tooltipText="Your SSH username on the remote host."
            />
            <HelpTextField
              label="SSH Private Key"
              value={sshKey}
              onChange={(input) => setSshKey(input.target.value)}
              tooltipText="Paste your SSH private key here."
              // multiline, so the user can paste multi-line key
              inputProps={{ multiline: true, rows: 4, style: { color: "white" } }}
            />
          </>
        )}

        <Box sx={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          {/* Save Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "darkgray",
              fontFamily: "monospace",
              fontWeight: "bold",
              flex: 1,
            }}
            onClick={handleSave}
            startIcon={<Save />}
          >
            Save Database Settings
          </Button>

          {/* Remove Button (only shown if an existing DB is selected) */}
          {selectedDatabase && selectedDatabase !== "new" && (
            <Button
              variant="contained"
              color="error"
              sx={{
                fontFamily: "monospace",
                fontWeight: "bold",
                flex: 1,
              }}
              onClick={handleRemove}
              startIcon={<DeleteForever />}
            >
              Remove Database
            </Button>
          )}
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default DatabaseSetup;
