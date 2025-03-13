import { Grid2 } from "@mui/material";
import GPTSetup from "./GPTSetup/gpt-setup.tsx";
import DatabaseSetup from "./DatabaseSetup/database-setup.tsx";

export const Settings = () => {
    return (
        <div>
            <Grid2 display="grid" sx={{ maxHeight: "1000px", gap: "20px", padding: "20px" }}>
                {/* GPT Query Form Component */}
                <GPTSetup />

                {/* Database Setup Component */}
                <DatabaseSetup />
            </Grid2>
        </div>
    );
};
