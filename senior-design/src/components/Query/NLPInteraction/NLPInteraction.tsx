import { useState } from "react";
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AutoAwesome } from "@mui/icons-material";

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
  const [response, setResponse] = useState("Enter a query to get assistance.");

  const handleQuery = async () => {
    if (!query.trim()) {
      setResponse("Query cannot be empty.");
      return;
    }

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

      <Box sx={{ display: "flex" }}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          label="Ask GPT"
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              style: { fontFamily: "monospace", color: "white" },
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={handleQuery}>
                    <AutoAwesome sx={{ color: "white" }} />
                  </IconButton>
                </InputAdornment>
              ),
            },
            inputLabel: { style: { fontFamily: "monospace", color: "white" } },
          }}
          sx={{ margin: 1 }}
        />
      </Box>

      <StyledButton variant="contained" onClick={handleQuery}>
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
