import { Box } from "@mui/material";
import Downloader from "./DataDownload/data-download.tsx";

export const Utilities = () => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <Box sx={{ 
                maxWidth: "1000px", 
                 width: "100%", 
                 display: "flex", 
                flexDirection: "column", 
                gap: "16px"
            }}>      
                <Box sx={{
                        maxWidth: "1000px",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    {/* Posydon Data Selector */}
                    <Downloader />
                </Box>
            </Box>
        </Box>
    );
};
