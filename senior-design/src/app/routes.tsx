import {Route, Routes} from 'react-router-dom';
import {ErrorPage} from "../components/ErrorPage/error-page.tsx";
import {Query} from "../components/Query/query.tsx";
import {Utilities} from "../components/Utilities/utilities.tsx";
import {AboutUs} from "../components/About_Us/about-us.tsx";
import {Settings} from "../components/Settings/settings.tsx";
import {History} from "../components/History/history.tsx";
import {createTheme, ThemeProvider} from "@mui/material";
/* istanbul ignore file -- @preserve */

const theme = createTheme({
    palette: {
        primary: {
            main: "#ffffff",
        },
        secondary: {
            main: "#ffffff",
        },
        background: {
            default: "#ffffff",
        },
        text: {
            primary: "#ffffff",
        },
    },
    typography: {
        fontFamily: "monospace",
        h1: {
            fontSize: "2.5rem",
            fontWeight: 600,
        },
        button: {
            textTransform: "none", // Prevent uppercase transformation
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "12px", // Custom border radius for buttons
                },
            },
        },
    },
});


const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path='/' element={<Query/>}/>
                <Route path='/Settings' element={<Settings/>}/>
                <Route path='/History' element={<History/>}/>
                <Route path='/Utilities' element={<Utilities/>}/>
                <Route path='/About_Us' element={<AboutUs/>}/>
                <Route path='*' element={<ErrorPage/>}/>
            </Routes>
        </ThemeProvider>

    )
};

export default App;
