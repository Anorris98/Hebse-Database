import Box from "@mui/material/Box";
import {IconButton, InputAdornment, TextField} from "@mui/material";
import {AutoAwesome, Save} from "@mui/icons-material";
import {useEffect} from 'react';


export const QueryInput = ({onQueryResult, savedQueries, setSavedQueries, inputValue, setInputValue}: {
    onQueryResult: (result: string) => void,
    savedQueries: string[]
    setSavedQueries: (value: (((prevState: string[]) => string[]) | string[])) => void,
    inputValue: string,
    setInputValue: (value: (((prevState: string) => string) | string)) => void
},) => {


    useEffect(() => {
        if ("saved" in localStorage) {
            setSavedQueries(JSON.parse(localStorage.saved));
        }
    }, []);

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
            setSavedQueries((prevState: string[]) => [...prevState, inputValue]);
        }
    }

  return (
    <Box
      component="div"
      sx={{
        backgroundColor: 'gray',
        flexGrow: 1,
        borderRadius: '15px',
        maxWidth: 'lg',
        fontFamily: 'monospace',
        marginTop: '20px',
        padding: '20px',
        color: 'white',
    }}
    >
      <Box sx={{ display: 'flex' }}>
        <TextField
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          id="outlined-basic"
          label="Query"
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              style: { fontFamily: 'monospace', color: 'white' },
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={() => getSQLFromNaturalLanguage()}>
                    <AutoAwesome sx={{ color: 'white' }} />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => saveQuery()}>
                    <Save sx={{ color: 'white' }} />
                  </IconButton>
                </InputAdornment>
              )
            },
            inputLabel: { style: { fontFamily: 'monospace', color: 'white' } }
          }}
          sx={{ margin: 1 }}
        />
      </Box>
    </Box>
  );
};
