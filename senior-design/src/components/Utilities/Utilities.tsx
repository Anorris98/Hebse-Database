import { NavBar } from "../NavigationBar/NavBar.tsx";
import { Grid2 } from "@mui/material";

export const Utilities = () => {
    return (
        <div>
            <NavBar /> {/* The navigation bar */}
            <Grid2 display={"grid"} sx={{ maxHeight: '1000px' }}>
                {/* Components for settings and utilities will be added here */}
            </Grid2>
        </div>
    );
};
