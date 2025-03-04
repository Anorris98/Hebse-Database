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
import HelpTextField from "../../HelpTextField/HelpTextField"; // Adjust path if needed

// Styled button matching dark-gray theme
const StyledButton = styled(Button)(() => ({
  backgroundColor: "darkgray",
  textTransform: "none",
  fontFamily: "monospace",
  fontWeight: "bold",
  marginTop: "10px",
  "&:hover": { backgroundColor: "#6c757d" },
}));

const NLPInteraction = () => {
  // User query and response state
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(
    "Enter your request or question to GPT. The system is trained on your schema and can help format queries or provide general assistance."
  );
  // GPT API key and connection status
  const [gptConnected, setGptConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);

  useEffect(() => {
    // Load GPT API key from localStorage
    const savedSettings = localStorage.getItem("gpt_settings");
    if (!savedSettings) {
      setCheckingConnection(false);
      setGptConnected(false);
      return;
    }

    try {
      const parsedSettings = JSON.parse(savedSettings);
      const apiKey = parsedSettings.apiKey?.trim();

      if (!apiKey) {
        setCheckingConnection(false);
        setGptConnected(false);
        return;
      }

      // Validate the API key with OpenAI
      verifyGPTConnection(apiKey);
    } catch (error) {
      console.error("Error parsing GPT settings:", error);
      setCheckingConnection(false);
      setGptConnected(false);
    }
  }, []);

  // Function to verify GPT API key by making a small request
  const verifyGPTConnection = async (apiKey: string) => {
    try {
      const res = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (res.ok) {
        setGptConnected(true);
      } else {
        console.error("GPT API key is invalid or service is unavailable.");
        setGptConnected(false);
      }
    } catch (error) {
      console.error("Error checking GPT connection:", error);
      setGptConnected(false);
    } finally {
      setCheckingConnection(false);
    }
  };

  // Send user’s query to your backend
  const handleQuery = async () => {
    try {
      const res = await fetch("http://localhost:8000/GetData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.message || "No response received.");
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
              : "❌ GPT Model is not connected. Please check Settings -> GPT API Settings."
          }
          sx={{ color: "white", fontFamily: "monospace" }}
        />
      </Box>

      {/* HelpTextField for user to input their GPT query */}
      <HelpTextField
        label="Ask GPT"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        tooltipText="Use this field to talk to GPT about how to format queries or for general schema-related assistance."
        inputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={handleQuery}>
                <AutoAwesome sx={{ color: "white" }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <StyledButton variant="contained" onClick={handleQuery} fullWidth disabled={!gptConnected}>
        Get Answer
      </StyledButton>

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
