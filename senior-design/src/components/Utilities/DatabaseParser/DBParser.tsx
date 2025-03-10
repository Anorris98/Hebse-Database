// https://zenodo.org/records/14205146/files/POSYDON_data.tar.gz?download=1
import React, { useEffect, useState } from 'react';
import {Box, Button, Container, IconButton, InputAdornment, Paper, Typography} from "@mui/material";
import {Save, Visibility, VisibilityOff} from "@mui/icons-material";
import {alpha, styled} from "@mui/material/styles";
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

interface Dataset {
    id: string;
    title: string;
    description: string;
    links: { self: string };
}

const DatasetList: React.FC = () => {
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const response = await fetch(
                    "https://zenodo.org/api/records/?communities=posydon&resource_type=dataset"
            );
            if (!response.ok) throw new Error("Failed to fetch datasets");

            const data = await response.json();
            setDatasets(data.hits.hits);
            } catch (err) {
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchDatasets();
    }, []);
        
    if (loading) return <p>Loading datasets...</p>;
    if (error) return <p>{error}</p>

    return (
        <div>
      <h1>Available Datasets</h1>
      <ul>
        {datasets.map((dataset) => (
          <li key={dataset.id}>
            <h2>{dataset.title}</h2>
            <p>{dataset.description}</p>
            <a href={dataset.links.self} download>
              Download Dataset
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  // For reference to create parser box
  return (
    <Container maxWidth="lg" sx={{ mt: 10, marginTop:"150px" }}>
        <StyledPaper elevation={6}>
            <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center", fontFamily: "monospace" , color: "white"  }}>
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
                tooltipText="Specify which GPT model you want to use. Example: 'gpt-4' or 'gpt-3.5-turbo'. A full list of models can be found on the OpenAI API documentation, or at https://platform.openai.com/docs/models."
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
            
            </Box>

            {/* Save Button */}
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
                    Save API Settings
                </Button>
            </Box>
        </StyledPaper>
    </Container>
);

};

export default DatasetList;

