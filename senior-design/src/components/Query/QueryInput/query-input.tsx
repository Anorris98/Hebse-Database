import Box from "@mui/material/Box";
import {Button, IconButton, TextField, Typography, InputAdornment,} from "@mui/material";
import {Save, Search, AutoAwesome,} from "@mui/icons-material";
import {useEffect, useState} from 'react';
import { CheckSharp, ErrorOutline } from '@mui/icons-material';
import { FormControlLabel, Checkbox } from '@mui/material';
/* istanbul ignore file -- @preserve */

interface QueryInputProperties {
    onQueryResult: (result: string) => void;
    savedQueries: string[];
    setSavedQueries: (value: string[] | ((previousState: string[]) => string[])) => void;
    inputValue: string;
    setInputValue: (value: string | ((previousState: string) => string)) => void;
    setPageNumber?: (value: number | ((previousState: number) => number)) => void; // Make it optional if not always used
}

export const QueryInput = ({
    onQueryResult,
    savedQueries,
    setSavedQueries,
    inputValue,
    setInputValue}: QueryInputProperties) => {

        const [databaseConnected, setdatabaseConnected] = useState(false);
        const [checkingConnection, setCheckingConnection] = useState(true);

        // 1) Load "saved" queries from localStorage
        useEffect(() => {
        if ("saved" in localStorage) {
            setSavedQueries(JSON.parse(localStorage.saved));
        }
        }, [setSavedQueries]);

        // 2) Check DB connection once on mount
        useEffect(() => {
        const testDBConnection = async () => {
            try {
            const savedSettings = localStorage.getItem("db_settings");
            if (!savedSettings) {
                setdatabaseConnected(false);
                return;
            }

            const parsed = JSON.parse(savedSettings);
            // If you do NOT have "/init_db" on your backend, 
            // this will fail with 404. Make sure the route exists 
            // or skip this call. 
            const result = await fetch("http://localhost:8000/init_db", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ db_settings: parsed }),
            });

            if (!result.ok) throw new Error("Connection failed");
            setdatabaseConnected(true);
            } catch (error) {
            console.error("DB connection check failed:", error);
            setdatabaseConnected(false);
            } finally {
            setCheckingConnection(false);
            }
        };

        testDBConnection();
        }, []);

        // Called on SEARCH
        async function getSQLFromNaturalLanguage() {
            const savedDatabaseSettings = localStorage.getItem("db_settings");
            if (!savedDatabaseSettings) {
                onQueryResult("Database settings not found.");
                return;
            }
            const parsedDatabaseSettings = JSON.parse(savedDatabaseSettings);
        
            // Empty query check
            if (!inputValue.trim()) {
                onQueryResult("Query cannot be empty.");
                return;
            }
        
            if (!databaseConnected) {
                onQueryResult("Cannot query: database is not connected.");
                return;
            }
        
            const data = { query: inputValue, db_settings: parsedDatabaseSettings };
        
            try {
                const response = await fetch(`http://localhost:8000/GetData`, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
        
                if (!response.ok) {
                    // Handle error response from the server
                    const errorBody = await response.json();
                    if (errorBody && errorBody.detail) {
                        onQueryResult(`Error from server: ${errorBody.detail}`);
                    } else {
                        onQueryResult(`An unknown error occurred: ${response.status}`);
                    }
                    return;
                }
        
                const body = await response.json();
                onQueryResult(body.data || "No result returned.");
            } catch (error) {
                console.error("Error fetching query result:", error);
                onQueryResult("An error occurred while fetching the result.");
            }
        }
        

            function saveQuery() {
                if (inputValue != '') {
                    localStorage.saved = JSON.stringify([...savedQueries, inputValue]);
                    setSavedQueries((previousState: string[]) => [...previousState, inputValue]);
                }
            }

            return (
                <Box
            sx={{
                backgroundColor: 'gray',
                flexGrow: 1,
                borderRadius: '15px',
                fontFamily: 'monospace',
                padding: '20px',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                height: '100%',
            }}
        >
            <Typography variant="h5" sx={{ marginBottom: "5px", fontFamily: "monospace" }}>
                SQL Query Input
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={databaseConnected}
                            icon={<ErrorOutline />}
                            checkedIcon={<CheckSharp />}
                            disabled
                            sx={{
                                color: "white",
                                "&.Mui-checked": {
                                    color: "white",
                                },
                            }}
                        />
                    }
                    label={
                        checkingConnection
                            ? "Checking DB connection..."
                            : (databaseConnected
                                ? "Database is connected!"
                                : "Database not connected. Check Settings -> Database.")
                    }
                    sx={{ color: "white", fontFamily: "monospace", '& .MuiFormControlLabel-label': { fontFamily: 'monospace', color: "white" } }}
                />
            </Box>
            <TextField
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                id="outlined-basic"
                label="Query"
                variant="outlined"
                fullWidth
                multiline
                minRows={12} // Match first TextField
                maxRows={12} // Match first TextField
                slotProps={{
                    input: {
                    startAdornment: (
                        <InputAdornment position="start">
                        <IconButton sx={{ width: 0, height: 0, opacity: 0, padding: 0, margin: 0 }}>
                            <AutoAwesome />
                        </IconButton>
                        </InputAdornment>
                    ),
                    },
                    inputLabel: {
                        style: { fontFamily: "monospace", color: "white" },
                    },
                }}
                sx={{
                    width: "100%", 
                    backgroundColor: "gray",
                    borderRadius: "5px",
                    marginBottom: "8px",
                    "& .MuiOutlinedInput-root": {
                    padding: "8px", // Match first TextField
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "White" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& .MuiInputBase-input": {
                    color: "white",
                    fontFamily: "monospace",
                    },
                }}
                />

            {/* Buttons Below the TextField */}
            <Box
                sx={{
                    display: "flex",
                    width: "100%", // Make sure buttons stay inside the parent box
                    gap: "10px",
                    marginTop: "10px",
                    padding: "10px", // Ensure buttons don’t touch the edges
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "darkgray",
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        color: "white",
                        flex: 1,
                    }}
                    onClick={getSQLFromNaturalLanguage}
                    startIcon={<Search />}
                >
                    SEARCH
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "darkgray",
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        color: "white",
                        flex: 1,
                    }}
                    onClick={saveQuery}
                    startIcon={<Save />}
                >
                    SAVE
                </Button>
            </Box>
        </Box>

            );
};