import { Grid2 } from "@mui/material";
import DBParser from "./DatabaseParser/DBParser";

export const Utilities = () => {
    return (
        <div>
            <Grid2 display="grid" sx={{ maxHeight: '1000px' , gap: '20px', padding: '20px' }}>
                {/* Posydon Data Selector */}
                <DBParser />

            </Grid2>
        </div>
    );
};
