import {alpha, styled} from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Build, Info, Search, Settings, Undo} from "@mui/icons-material";

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: alpha(theme.palette.background.default, 0.4),
    boxShadow: theme.shadows[1],
    padding: '8px 12px'
}));

const StyledButton = styled(Button)(() => ({
    marginRight: '8px',
    backgroundColor: 'darkgray',
    textTransform: 'none',
    maxHeight: '120%',
    fontFamily: 'monospace'
}))


export const NavBar = () => {
    const navigate = useNavigate(); // React Router navigation hook

    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 'calc(var(--template-frame-height, 0px) + 28px)',
            }}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center', px: 0, justifyContent: 'left'}}>
                        <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                            <StyledButton variant="contained" size="small" startIcon={<Search/>}
                                onClick={() => navigate("/")}>
                                Query
                            </StyledButton>
                            <StyledButton variant="contained" size="small" startIcon={<Undo/>}>
                                History
                            </StyledButton>
                            <StyledButton variant="contained" size="small" startIcon={<Build/>}
                                onClick={() => navigate("/Utilities")}>
                                Utilities
                            </StyledButton>
                            <StyledButton variant="contained" size="small" startIcon={<Settings/>}
                                onClick={() => navigate("/Settings")}>
                                Settings
                            </StyledButton>
                            <StyledButton variant="contained" size="small" startIcon={<Info/>}
                                onClick={() => navigate("/About_Us")}>
                                About Us
                            </StyledButton>
                        </Box>
                    </Box>
                    <Box component='section' sx={{
                        p: 1,
                        border: '5px dashed black',
                        fontSize: '20px',
                        fontFamily: 'monospace',
                        fontWeight: 'bold'
                    }}>
                        HADES
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
};