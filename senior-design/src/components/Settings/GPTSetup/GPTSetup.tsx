import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Container, Paper, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const GPTSetup = () => {
    // State variables
    const [apiKey, setApiKey] = useState("");
    const [model, setModel] = useState("gpt-4");
    const [maxTokens, setMaxTokens] = useState("100");
    const [temperature, setTemperature] = useState("0.7");
    const [showApiKey, setShowApiKey] = useState(false); // New state for toggling visibility

    // Load settings from localStorage when the component mounts
    useEffect(() => {
        const savedSettings = localStorage.getItem("gpt_settings");
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                setApiKey(parsedSettings.apiKey || "");
                setModel(parsedSettings.model || "gpt-4");
                setMaxTokens(parsedSettings.max_tokens?.toString() || "100");
                setTemperature(parsedSettings.temperature?.toString() || "0.7");
            } catch (error) {
                console.error("Error loading settings:", error);
            }
        }
    }, []);

    // Function to save settings to localStorage
    const handleSave = () => {
        const settings = {
            apiKey,
            model,
            max_tokens: parseInt(maxTokens, 10),
            temperature: parseFloat(temperature),
        };

        console.log("Saving settings:", settings);
        localStorage.setItem("gpt_settings", JSON.stringify(settings));
        alert("Settings saved!");
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 10 }}>
            <Paper
                elevation={6}
                sx={{
                    padding: "30px",
                    borderRadius: "12px",
                    backgroundColor: "gray",
                    color: "white",
                    fontFamily: "monospace",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
                }}
            >
                <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
                    GPT API Settings
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                    <TextField
                        fullWidth
                        label="API Key"
                        type={showApiKey ? "text" : "password"}
                        variant="outlined"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        sx={{ backgroundColor: "#616161", borderRadius: "5px" }}
                        InputProps={{
                            style: { color: "white" },
                            endAdornment: (
                                <IconButton onClick={() => setShowApiKey(!showApiKey)}>
                                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />
                </Box>

                <TextField
                    fullWidth
                    label="Model (e.g., gpt-4, gpt-3.5-turbo)"
                    variant="outlined"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    sx={{ marginBottom: "15px", backgroundColor: "#616161", borderRadius: "5px" }}
                    InputProps={{ style: { color: "white" } }}
                />

                <Box sx={{ display: "flex", gap: "15px" }}>
                    <TextField
                        fullWidth
                        label="Max Tokens"
                        type="number"
                        variant="outlined"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(e.target.value)}
                        sx={{ backgroundColor: "#616161", borderRadius: "5px" }}
                        InputProps={{ style: { color: "white" } }}
                    />

                    <TextField
                        fullWidth
                        label="Temperature (0-1)"
                        type="number"
                        variant="outlined"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        sx={{ backgroundColor: "#616161", borderRadius: "5px" }}
                        InputProps={{ style: { color: "white" } }}
                    />
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        marginTop: "15px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#125ea5" },
                    }}
                    onClick={handleSave}
                >
                    Save Settings
                </Button>
            </Paper>
        </Container>
    );
};

export default GPTSetup;
