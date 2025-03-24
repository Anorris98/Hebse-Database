import { Box } from "@mui/material";
import GPTSetup from "./GPTSetup/gpt-setup.tsx";
import DatabaseSetup from "./DatabaseSetup/database-setup.tsx";

export const Settings = () => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <Box sx={{ 
                maxWidth: "1000px", 
                width: "100%", 
                display: "flex", 
                flexDirection: "column", 
                gap: "16px"
            }}>
                {/* GPT Query Form Component */}
                <GPTSetup />
                 {/* Database Setup Component */}
                <DatabaseSetup />
            </Box>
        </Box>
    );
};
