import { Box, Grid2, IconButton, InputAdornment, TextField } from "@mui/material";
import { AutoAwesome, Save } from "@mui/icons-material";
import { Dispatch, SetStateAction } from "react";

interface QueryInputProps {
  onQueryResult: Dispatch<SetStateAction<string>>;
  setSavedQueries: Dispatch<SetStateAction<string[]>>;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  onQueryResult,
  setSavedQueries,
  inputValue,
  setInputValue
}) => {
  async function getSQLFromNaturalLanguage() {
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
    // Save the query if it's not empty and not already saved
    if (inputValue !== '') {
      setSavedQueries(prev => {
        if (!prev.includes(inputValue)) {
          const newSaved = [...prev, inputValue];
          localStorage.saved = JSON.stringify(newSaved);
          return newSaved;
        }
        return prev;
      });
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
        marginTop: '200px'
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
