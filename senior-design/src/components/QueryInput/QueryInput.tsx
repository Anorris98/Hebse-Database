import Box from "@mui/material/Box";
import { Grid2, IconButton, InputAdornment, TextField } from "@mui/material";
import { ArrowDropDown, AutoAwesome, Clear, ContentCopyOutlined, Save } from "@mui/icons-material";
import { useEffect, useState } from 'react';


export const QueryInput = ({ onQueryResult }: { onQueryResult: (result: string) => void }) => {
    const [inputValue, setInputValue] = useState('');
    const [savedQueries, setSavedQueries] = useState<string[]>([]);
    const [displaySavedQueries, setDisplaySavedQueries] = useState<boolean>(false);

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
   
        let data = {
            query: inputValue //updated it to a query type for the backend, mostly for troubleshooting purposes. 
        };

    
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
            onQueryResult(body.data || "No result returned."); // Pass result to parent or state
        } catch (error) {
            console.error("Error fetching query result:", error);
            onQueryResult("An error occurred while fetching the result."); // Pass error message
        }
    }

    function saveQuery() {
        let saved = [...savedQueries];
        if (inputValue != '' && !saved.includes(inputValue)) {
            saved.push(inputValue);
            localStorage.saved = JSON.stringify(saved);
            setSavedQueries(saved);
        }
    }

    function deleteQuery(item: string) {
        let saved = [...savedQueries];
        const index = saved.indexOf(item);
        if (index > -1) {
            saved.splice(index, 1);
            localStorage.saved = JSON.stringify(saved);
            setSavedQueries(saved);
        }
    }

    return (
        <Grid2 display={"grid"} sx={{maxHeight: '1000px'}}>
            <Box component="div" sx={{
            alignItems: 'center',
            flexGrow: 1,
            maxWidth: 'lg',
            backgroundColor: 'gray',
            borderRadius: '15px',
            marginTop: '20px',
            fontFamily: 'monospace'
            }}>
                <Box sx={{fontSize: '20px', fontWeight: 'bold'}}>
                    Saved Queries <IconButton sx={{maxHeight:"10px", width: "30px"}}  onClick={() => setDisplaySavedQueries(!displaySavedQueries)}><ArrowDropDown
                                sx={{color: 'white', backgroundColor:"black"}}/></IconButton>
                </Box>
                {
                    displaySavedQueries ?
                    savedQueries.map((item: string, index: number) => (
                        <Box sx={{
                            borderRadius: "8px",
                            border: "1px solid transparent",
                            textAlign:'center',
                            maxWidth: "calc(100% - 24px)",
                            padding: '4px',
                            margin: '8px',
                            backgroundColor: 'darkgray',
                            textTransform: 'none',
                            fontFamily: 'monospace',
                            fontSize:"16px",
                            color: 'white',
                            display:"inline-flex",
                            alignItems: "center",
                            flexDirection: 'row-reverse'
                            }} key={index}>
                            <IconButton sx={{height: "10px", width: "30px", textAlign: "center"}} onClick={() => deleteQuery(item)}><Clear
                                sx={{color: 'white', backgroundColor:"black"}}/></IconButton>
                            <IconButton sx={{height: "10px", width: "30px", textAlign: "center"}} onClick={() => setInputValue(item)}><ContentCopyOutlined
                                sx={{color: 'white', backgroundColor:"black"}}/></IconButton>
                            <Box flexGrow={1} component="div" sx={{whiteSpace: 'normal', overflowWrap: 'break-word', textAlign:'center', width:"calc(100% - 60px)"}}>{item}</Box>
                        </Box>
                    )) : null
                }
            </Box>
            <Box component="div" sx={{
                backgroundColor: 'gray',
                flexGrow: 1,
                borderRadius: '15px',
                maxWidth: 'lg',
                fontFamily: 'monospace',
                marginTop: '200px'
            }}>
                <Box sx={{display: 'flex'}}>
                    <TextField 
                        value={inputValue} 
                        onChange={(event) => setInputValue(event.target.value)} 
                        id="outlined-basic" 
                        label="Query" 
                        variant="outlined" 
                        fullWidth={true} 
                        slotProps={{
                            input: {
                                style: {fontFamily: 'monospace', color: 'white'},
                                startAdornment: ( 
                                    <InputAdornment position={"start"}> 
                                        <IconButton onClick={() => getSQLFromNaturalLanguage()}>
                                            <AutoAwesome sx={{color: 'white'}}/>
                                        </IconButton>
                                    </InputAdornment>
                                    ),
                                endAdornment: 
                                    <InputAdornment position={"end"}> 
                                        <IconButton onClick={() => saveQuery()}>
                                            <Save sx={{color: 'white'}}/>
                                        </IconButton>
                                    </InputAdornment>
                            }, inputLabel: {style: {fontFamily: 'monospace', color: 'white'}}
                        }} sx={{margin: 1}}/>
                </Box>
            </Box>
        </Grid2>

    )
}

