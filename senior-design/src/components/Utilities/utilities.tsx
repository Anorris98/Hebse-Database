import { Box } from "@mui/material";
import Downloader from "./DataDownload/data-download.tsx";

export const Utilities = () => {
    return (
        <div>
            <Box
                sx={{
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
        </div>
    );
};
