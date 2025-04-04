// https://zenodo.org/records/14205146/files/POSYDON_data.tar.gz?download=1
import {Paper, Tooltip, Typography, Box, Button, Collapse} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DownloadIcon from "@mui/icons-material/Download";
import {useEffect, useState} from 'react';
import {alpha, styled} from "@mui/material/styles";

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

/* Interface for dataset file attributes from html page */
interface DatasetFile {
    key: string;
    links: { self: string };
    size: number;
    checksum: string;
}

/* Interface for dataset basic attributes from html page */
interface Dataset {
    id: string;
    title: string;
    metadata: { description: string };
    links: { self: string };
    files: DatasetFile[];
}

/* Fetch available dataset info from posydon download page */
const DatasetList: React.FC = () => {
    const [expandedId, setExpandedId] = useState<string | undefined>();
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    
    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const response = await fetch(
                    "https://zenodo.org/api/records/?communities=posydon&resource_type=dataset"
            );
            if (!response.ok) throw new Error("Failed to fetch datasets");

            const data = await response.json();
            setDatasets(data.hits.hits);
            } catch (error) {
                setError("Error fetching data" + error);
            } finally {
                setLoading(false);
            }
        };

        fetchDatasets();
    }, []);

    if (loading) return <p>Loading datasets...</p>;
    if (error) return <p>{error}</p>

    
  return (
    /* Background box and boxes for dataset + file info */
    
    <Box
      sx={{
        backgroundColor: "gray",
        borderRadius: "15px",
        maxWidth: "lg",
        width: "100%",
        fontFamily: "monospace",
        padding: "20px",
      }}
    >
      <Box 
        sx={{ 
          fontSize: "30px",
          marginBottom: "20px", 
          textAlign: "center", 
          fontFamily: "monospace" , 
          color: "white",
        }}>
          Posydon Datasets Available
      </Box>
    
            {datasets.map((dataset) => {
              const isExpanded = expandedId === dataset.id;
              return (
                <Box
                  key={dataset.id}
                  sx={{
                    marginBottom: "16px",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                {/* Box for each dataset */}
                <StyledPaper sx={{ padding: "16px" }}>
                    <Typography variant="h5" 
                      sx={{ 
                        marginBottom: "12px", 
                        color: "white", 
                        fontFamily: "monospace",
                        textAlign: "left"
                      }}>
                      {dataset.title}
                    </Typography>

                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px"
                      }}
                    >
                      {/* Description Button */}
                      <Button
                        variant="contained"
                        onClick={() => setExpandedId(isExpanded ? undefined : dataset.id)}
                        endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        sx={{
                          flex: 1,
                          backgroundColor: "gray",
                          fontFamily: "monospace",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {isExpanded ? "HIDE DESCRIPTION" : "SHOW DESCRIPTION"}
                      </Button>

                      {/* Download Button */}
                      {dataset.files?.map((file) => (
                            
                        <Tooltip
                          key={file.key}
                          title={
                            <>
                              <div><strong>Name:</strong> {file.key}</div>
                              <div><strong>Size:</strong> {(file.size / 1e9).toFixed(2)} GB</div>
                            </>
                          }
                          arrow
                          placement="bottom"
                        >
                          <Button 
                            variant="contained"
                            onClick={() => window.open(file.links.self, "_blank")}
                            endIcon={<DownloadIcon/>}
                            sx={{
                              flex: 1,
                              backgroundColor: "gray",
                              fontFamily: "monospace",
                              fontWeight: "bold"
                                  
                            }}
                          >
                            DOWNLOAD
                          </Button>
                        </Tooltip>
                      ))}
                    </Box>

                  {/* Collapse Wrapper */}
                  <Collapse 
                    in={isExpanded}
                    timeout="auto"
                    unmountOnExit
                  >

                    <StyledPaper 
                      sx={{ 
                        backgroundColor: "white",
                        mt: 2
                      }}>
                      <Typography
                        component="div"
                        sx={{ 
                          color: "gray", 
                          marginBottom: "8px", 
                          fontFamily: "monospace",
                          padding: "12px"
                        }}
                      >
                        <div dangerouslySetInnerHTML={{__html: dataset.metadata?.description || ""}}/>
                      </Typography>
                    </StyledPaper>
                  </Collapse>

                </StyledPaper>

              </Box>
              );
            })}
      </Box>
  )
}

export default DatasetList;

