import { useState, useEffect } from "react";
import { Box, Button, Typography, Container, Paper, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { alpha, styled } from "@mui/material/styles";
import HelpTextField from "../../HelpTextField/HelpTextField.tsx";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: "30px",
    borderRadius: "12px",
    backdropFilter: "blur(24px)",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: alpha(theme.palette.background.default, 0.4),
    boxShadow: theme.shadows[1],
    color: theme.palette.text.primary,
    fontFamily: "monospace",
}));

const StyledButton = styled(Button)(() => ({
    backgroundColor: "darkgray",
    textTransform: "none",
    fontFamily: "monospace",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#6c757d" },
}));

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

    const apiKeyInputProps = {
        endAdornment: (
            <InputAdornment position="end">
                <IconButton onClick={() => setShowApiKey(!showApiKey)} edge="end">
                    {showApiKey ? <VisibilityOff sx={{ color: "white" }} /> : <Visibility sx={{ color: "white" }} />}
                </IconButton>
            </InputAdornment>
        ),
    };


return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
        <StyledPaper elevation={6}>
            <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
                GPT API Settings
            </Typography>

            {/* API Key Field with Visibility Toggle */}
            <HelpTextField
                label="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type={showApiKey ? "text" : "password"}
                tooltipText="Enter your OpenAI API Key. This key is required to access GPT models."
                inputProps={apiKeyInputProps} 
            />

            {/* Model Selection Field */}
            <HelpTextField
                label="Model (e.g., gpt-4, gpt-3.5-turbo)"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                tooltipText="Specify which GPT model you want to use. Example: 'gpt-4' or 'gpt-3.5-turbo'."
            />

            {/* Max Tokens and Temperature Fields */}
            <Box sx={{ display: "flex", gap: "15px", marginTop: "15px" }}>
                <HelpTextField
                    label="Max Tokens"
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(e.target.value)}
                    tooltipText="Maximum number of tokens the model can generate. A higher value means longer responses."
                />
                <HelpTextField
                    label="Temperature (0-1)"
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    tooltipText="Controls randomness. A lower value (e.g., 0.2) makes responses more focused, while a higher value (e.g., 0.9) makes them more creative."
                />
            </Box>

            {/* Save Button */}
            <StyledButton
                variant="contained"
                fullWidth
                sx={{ marginTop: "20px" }}
                onClick={handleSave}
            >
                Save Settings
            </StyledButton>
        </StyledPaper>
    </Container>
);


    return (
        <Container maxWidth="lg" sx={{ mt: 10 }}>
            <StyledPaper elevation={6}>
                <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
                    GPT API Settings
                </Typography>

                {/* API Key Field with Visibility Toggle */}
                <HelpTextField
                    label="API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    type={showApiKey ? "text" : "password"}
                    tooltipText="Enter your OpenAI API Key. This key is required to access GPT models."
                    inputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowApiKey(!showApiKey)} edge="end">
                                    {/* {showApiKey ? <VisibilityOff /> : <Visibility />} */}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Model Selection Field */}
                <HelpTextField
                    label="Model (e.g., gpt-4, gpt-3.5-turbo)"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    tooltipText="Specify which GPT model you want to use. Example: 'gpt-4' or 'gpt-3.5-turbo'."
                />

                {/* Max Tokens and Temperature Fields */}
                <Box sx={{ display: "flex", gap: "15px", marginTop: "15px" }}>
                    <HelpTextField
                        label="Max Tokens"
                        type="number"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(e.target.value)}
                        tooltipText="Maximum number of tokens the model can generate. A higher value means longer responses."
                    />
                    <HelpTextField
                        label="Temperature (0-1)"
                        type="number"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        tooltipText="Controls randomness. A lower value (e.g., 0.2) makes responses more focused, while a higher value (e.g., 0.9) makes them more creative."
                    />
                </Box>

                {/* Save Button */}
                <StyledButton
                    variant="contained"
                    fullWidth
                    sx={{ marginTop: "20px" }}
                    onClick={handleSave}
                >
                    Save Settings
                </StyledButton>
            </StyledPaper>
        </Container>
    );
};

export default GPTSetup;
