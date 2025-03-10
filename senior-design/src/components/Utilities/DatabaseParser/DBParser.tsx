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

  //   return (
  //       <div>
  //     <h1>Available Datasets</h1>
  //     <ul>
  //       {datasets.map((dataset) => (
  //         <li key={dataset.id}>
  //           <h2>{dataset.title}</h2>
  //           <p>{dataset.description}</p>
  //           <a href={dataset.links.self} download>
  //             Download Dataset
  //           </a>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );

  // return (
  //   <Box
  //       sx={{
  //           backgroundColor: "gray",
  //           borderRadius: "15px",
  //           maxWidth: "lg",
  //           width: "100%",
  //           fontFamily: "monospace",
  //           padding: "20px",
  //           marginTop: "0px", // Ensures there's no margin at the top
  //           paddingTop: "20px", // Removes padding at the top
  //           textAlign: "center",
  //       }}
  //   >
  //       <Box sx={{ fontSize: '20px', fontWeight: 'bold' }}>
  //         Available Datasets
  //       </Box>
  //       <Box sx={{ fontSize: '16px' }}>
  //         The creators of HADES are interdisciplinary team of Computer, Software, and Cyber Security Engineers from Iowa State University. This project was produced as part of our Senior Design class. The team is made up of James Byrd, Eamon Collins, Alek Norris, Alex Polston, Andrew Snyder, and Svyatoslav Varnitskyy. We are all passionate about developing new and innovative solutions to complex problems. We all have an interest in space and astronomy, and are pleased to develop HADES as a way to help astronomy advance. More details about our project can be found at <a href="https://sdmay25-20.sd.ece.iastate.edu/" target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>https://sdmay25-20.sd.ece.iastate.edu/</a>. 
  //       </Box>
  //   </Box>
  // );

  // For reference to create parser box
  return (
    <Container maxWidth="lg" sx={{ mt: 10, marginTop:"150px" }}>
        <StyledPaper elevation={6}>
            <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center", fontFamily: "monospace" , color: "white"  }}>
                Posydon Databases Available
            </Typography>

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

        </StyledPaper>
    </Container>
);

};

export default DatasetList;

