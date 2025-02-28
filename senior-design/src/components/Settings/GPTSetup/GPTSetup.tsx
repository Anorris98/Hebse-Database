import { useState, useEffect } from "react";
import { Box, Button, Typography, Container, Paper, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import HelpTextField from "../../HelpTextField/HelpTextField.tsx"; 

const GPTSetup = () => {
    const [apiKey, setApiKey] = useState("");
    const [model, setModel] = useState("gpt-4");
    const [maxTokens, setMaxTokens] = useState("100");
    const [temperature, setTemperature] = useState("0.7");
    const [showApiKey, setShowApiKey] = useState(false);

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

                {/* API Key Field with Visibility Toggle */}
                <Box sx={{ display: "flex", alignItems: "center", marginBottom: "15px", gap: "10px" }}>
                    <HelpTextField
                        label="API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        type={showApiKey ? "text" : "password"}
                        tooltipText="Enter your OpenAI API Key. This key is required to access GPT models."
                        fullWidth
                    />
                    <IconButton onClick={() => setShowApiKey(!showApiKey)}>
                        {showApiKey ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </Box>

                {/* Model Selection Field */}
                <HelpTextField
                    label="Model (e.g., gpt-4, gpt-3.5-turbo)"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    tooltipText="Specify which GPT model you want to use. Example: 'gpt-4' or 'gpt-3.5-turbo'."
                    fullWidth
                />

                {/* Max Tokens and Temperature Fields */}
                <Box sx={{ display: "flex", gap: "15px" }}>
                    <HelpTextField
                        label="Max Tokens"
                        type="number"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(e.target.value)}
                        tooltipText="Maximum number of tokens the model can generate. A higher value means longer responses."
                        fullWidth
                    />
                    <HelpTextField
                        label="Temperature (0-1)"
                        type="number"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        tooltipText="Controls randomness. A lower value (e.g., 0.2) makes responses more focused, while a higher value (e.g., 0.9) makes them more creative."
                        fullWidth
                    />
                </Box>

                {/* Save Button */}
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
