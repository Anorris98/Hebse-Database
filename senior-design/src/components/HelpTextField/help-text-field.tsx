import { TextField, IconButton, Tooltip, Box } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

interface HelpTextFieldProperties {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    tooltipText: string;
    inputProps?: object; 
}

const HelpTextField: React.FC<HelpTextFieldProperties> = ({ label, value, onChange, type = "text", tooltipText, inputProps }) => {
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
                slotProps={{input: {
                    style: { fontFamily: 'monospace', color: 'white' },
                        ...inputProps
                    },
                    inputLabel: { style: { fontFamily: 'monospace', color: 'white' } }}}
                sx={{ backgroundColor: 'gray', borderRadius: "5px", fieldSet: {borderColor: 'white' }}}
            />
        </Box>
    );
};

export default HelpTextField;
