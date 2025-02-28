import { Grid2 } from "@mui/material";
import GPTQueryForm from "../GPTSetup/GPTSetup.tsx";

export const Settings = () => {
    return (
        <div>
            <Grid2 display="grid" sx={{ maxHeight: "1000px", gap: "20px", padding: "20px" }}>
                {/* Existing Settings Components Can Be Added Here */}
                
                {/* GPT Query Form Component */}
                <GPTQueryForm />
            </Grid2>
        </div>
    );
};
