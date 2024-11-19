import Box from "@mui/material/Box";
import {Grid2, IconButton, InputAdornment, TextField} from "@mui/material";
import {AutoAwesome} from "@mui/icons-material";
import { useState } from 'react';


export const QueryInput = () => {
    const [inputValue, setInputValue] = useState('');
    let data = {
        "string": inputValue
    }
    async function getSQLFromNaturalLanguage() {
        await fetch(`http://localhost:8000/GetData`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json()).then(body => setInputValue(body.message));
    }

    return (
        <Grid2 display={"grid"} sx={{maxHeight: '1000px'}}>
            <Box component="div" sx={{
                backgroundColor: 'gray',
                flexGrow: 1,
                borderRadius: '15px',
                maxWidth: 'lg',
                fontFamily: 'monospace',
                marginTop: '200px'
            }}>
                <Box sx={{fontSize: '20px', fontWeight: 'bold'}}>
                    How can I help?
                </Box>
                <Box sx={{fontSize: '16px'}}>
                    Welcome to the Binary Star Query Bot! This interactive assistant is
                    designed to help you explore and retrieve data on binary star systems
                    with ease. Whether you're an astronomer, student, or space enthusiast,
                    you can quickly access detailed information on various binary systems,
                    including orbital periods, mass, luminosity, and more. Additionally,
                    you can upload your own binary star data, and the bot will parse and
                    integrate it for seamless querying. From answering general questions
                    about binary stars to providing insights into specific systems, this
                    bot is here to enhance your understanding of the fascinating world of
                    stellar pairs. Let’s explore the stars together!
                </Box>
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
                    <TextField value={inputValue} onChange={(event) => setInputValue(event.target.value)} id="outlined-basic" label="Query" variant="outlined" fullWidth={true} slotProps={{
                        input: {
                            style: {fontFamily: 'monospace', color: 'white'},
                            startAdornment: <InputAdornment position={"start"}> <IconButton onClick={() => getSQLFromNaturalLanguage()}><AutoAwesome
                                sx={{color: 'white'}}/></IconButton></InputAdornment>
                        }, inputLabel: {style: {fontFamily: 'monospace', color: 'white'}}
                    }} sx={{margin: 1}}/>
                </Box>
            </Box>
        </Grid2>

    )
}

