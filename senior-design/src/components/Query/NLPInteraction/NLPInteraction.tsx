import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AutoAwesome } from "@mui/icons-material";
import HelpTextField from "../../HelpTextField/HelpTextField";

const StyledButton = styled(Button)(() => ({
  backgroundColor: "darkgray",
  textTransform: "none",
  fontFamily: "monospace",
  fontWeight: "bold",
  marginTop: "10px",
  "&:hover": { backgroundColor: "#6c757d" },
}));

const NLPInteraction = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(
    "Enter your request or question to GPT. The system can help format queries or provide general assistance."
  );

  // GPT connection checks
  const [gptConnected, setGptConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);

  // -----------------------------------------------------------------
  // On mount, we attempt a quick "ping" to /ask_gpt with a test query
  // to confirm GPT settings are valid. If success => connected.
  // -----------------------------------------------------------------
  useEffect(() => {
    const testGPTConnection = async () => {
      try {
        // Grab GPT settings from localStorage
        const savedSettings = localStorage.getItem("gpt_settings");
        if (!savedSettings) {
          setGptConnected(false);
          return;
        }

        const parsedSettings = JSON.parse(savedSettings);
        // Construct a small test request
        const payload = {
          query: "Hello GPT, are you there?",  // a minimal test
          settings: parsedSettings,
        };

        const res = await fetch("http://localhost:8000/ask_gpt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`Connection test failed: HTTP status ${res.status}`);
        }

        const data = await res.json();
        // If we get a response key with text in it, we assume success
        if (data?.response) {
          setGptConnected(true);
        }
      } catch (error) {
        console.error("Error checking GPT connection:", error);
        setGptConnected(false);
      } finally {
        setCheckingConnection(false);
      }
    };

    testGPTConnection();
  }, []);

  // -----------------------------------------------------------------
  // Handler that actually calls the /ask_gpt endpoint with the user’s
  // query + the GPT settings from localStorage
  // -----------------------------------------------------------------
  const handleQuery = async () => {
    setResponse("Awaiting GPT response...");
    try {
      const savedSettings = localStorage.getItem("gpt_settings");
      if (!savedSettings) {
        setResponse("GPT settings not found. Please set up your API key first.");
        return;
      }

      const parsedSettings = JSON.parse(savedSettings);
      const payload = {
        query,
        settings: parsedSettings,
      };

      const res = await fetch("http://localhost:8000/ask_gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      // The backend returns { response.content: "...GPT output..." }
      setResponse(data.response.content || "No response received from GPT."); //this took forever to figure out, if future updates change the response key, this will need to be updated.
    } catch (error) {
      console.error("Error fetching GPT response:", error);
      setResponse("An error occurred while fetching the response.");
    }
  };

  return (
    <Box
      component="div"
      sx={{
        backgroundColor: "gray",
        flexGrow: 1,
        borderRadius: "15px",
        maxWidth: "lg",
        fontFamily: "monospace",
        marginTop: "20px",
        padding: "20px",
        color: "white",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "15px", fontFamily: "monospace" }}>
        Query Assistance
      </Typography>

      {/* Connection Status */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={gptConnected}
              disabled
              sx={{
                color: "white",
                "&.Mui-checked": {
                  color: "white",
                },
              }}
            />
          }
          label={
            checkingConnection
              ? "Checking GPT connection..."
              : gptConnected
              ? "✅ GPT Model is connected!"
              : "❌ GPT Model is not connected. Check Settings -> GPT API Settings."
          }
          sx={{ color: "white", fontFamily: "monospace" }}
        />
      </Box>

      {/* User input field for GPT query */}
      <HelpTextField
        label="Ask GPT"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        tooltipText="Use this field to talk to GPT about query formatting or get general schema help."
        inputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={handleQuery} disabled={!gptConnected}>
                <AutoAwesome sx={{ color: "white" }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Submit button
      <StyledButton variant="contained" onClick={handleQuery} fullWidth disabled={!gptConnected}>
        Get Answer
      </StyledButton> */}

      {/* GPT Response area */}
      <Box
        sx={{
          marginTop: "15px",
          backgroundColor: "inherit",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <Typography sx={{ fontFamily: "monospace" }}>{response}</Typography>
      </Box>
    </Box>
  );
};

export default NLPInteraction;
