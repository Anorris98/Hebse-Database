import Box from "@mui/material/Box";
import {Button, IconButton, TextField, Typography, InputAdornment,} from "@mui/material";
import {Save, Search, AutoAwesome,} from "@mui/icons-material";
import {useEffect} from 'react';


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

    useEffect(() => {
        if ("saved" in localStorage) {
            setSavedQueries(JSON.parse(localStorage.saved));
        }
    }, [setSavedQueries]);

    async function getSQLFromNaturalLanguage() {

        //debug statement/check
        if (!inputValue.trim()) {
            onQueryResult("Query cannot be empty.");
            return;
        }

        const data = { query: inputValue };

        try {
            const response = await fetch(`http://localhost:8000/GetData`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const body = await response.json();
            setInputValue(body.message); // Update input value
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