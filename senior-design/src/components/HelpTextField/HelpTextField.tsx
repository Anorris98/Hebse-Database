import { TextField, IconButton, Tooltip, Box } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

interface HelpTextFieldProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    tooltipText: string;
}

const HelpTextField: React.FC<HelpTextFieldProps> = ({ label, value, onChange, type = "text", tooltipText }) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
            <Tooltip title={tooltipText} arrow>
                <IconButton>
                    <InfoOutlined style={{ color: "white" }} />
                </IconButton>
            </Tooltip>
            <TextField
                fullWidth
                label={label}
                variant="outlined"
                type={type}
                value={value}
                onChange={onChange}
                sx={{ backgroundColor: "#616161", borderRadius: "5px" }}
                InputProps={{ style: { color: "white" } }}
            />
        </Box>
    );
};

export default HelpTextField;
