import { Grid2 } from "@mui/material";
import GPTSetup from "./GPTSetup/GPTSetup.tsx";

export const Settings = () => {
    return (
        <div>
            <Grid2 display="grid" sx={{ maxHeight: "1000px", gap: "20px", padding: "20px" }}>
                {/* Existing Settings Components go Here */}
                
                {/* GPT Query Form Component */}
                <GPTSetup />
            </Grid2>
        </div>
    );
};
