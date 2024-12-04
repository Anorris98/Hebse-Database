// import React from 'react';
import Box from '@mui/material/Box';

export const QueryResults = ({ queryResult }: { queryResult: string }) => {
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
            <Box sx={{ fontSize: '20px', fontWeight: 'bold' }}>Query Results</Box>
            <Box sx={{ fontSize: '16px', marginTop: '10px' }}>
                {queryResult || "No results available."}
            </Box>
        </Box>
    );
};
