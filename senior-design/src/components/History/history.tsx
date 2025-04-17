import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {Box, IconButton} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import {useEffect, useState} from "react";

async function downloadCSVFromHistory(inputValue: { name: string; id: string; }) {
    const data = { query: inputValue.name, history: true};

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
    } catch (error) {
        console.error("Error fetching query result:", error);
    }

    try{
        const response = await fetch('http://localhost:8000/exportData')
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const blob = await response.blob();
        const url = globalThis.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "query_" + inputValue.id + "_results.csv";
        document.body.append(link);
        link.click();
        link.remove();
        globalThis.URL.revokeObjectURL(url);
    }
    catch(error){
        console.error("Error downloading data:", error);
    }


}


const renderDetailsButton = (parameters: { row: { name: string; id: string; }; }) => {
    return (
        <strong>
            <IconButton children = {<DownloadIcon/>} sx={{color: 'white' }} onClick={() => downloadCSVFromHistory(parameters.row)}/>
        </strong>
    )
}


export const History = () => {
    const [queries, setQueries] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/getHistory")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch recent queries");
                }
                return response.json();
            })
            .then((data) => {
                const rows = data.recent_queries.map((query: { id: string; query_sql: string; time: string | number | Date; }) => ({
                    id: query.id,
                    name: query.query_sql,
                    datetime: new Date(query.time).toLocaleString(),
                }));
                setQueries(rows);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Query ID', width: 100, headerClassName: 'header' },
        { field: 'name', headerName: 'Query', flex: 1, headerClassName: 'header' },
        { field: 'datetime', headerName: 'Queried', width: 200, headerClassName: 'header' },
        { field: 'download', headerName: 'Download', width: 100, renderCell: renderDetailsButton, headerClassName: 'header'}
    ];

    const paginationModel = { page: 0, pageSize: 8 };

    return (
        <Box sx={{
            backgroundColor: "gray",
            borderRadius: "15px",
            width: "1100px",
            fontFamily: "monospace",
            padding: "20px",
            marginTop:"100px",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            height: "500px",
        }}>
            <Box sx={{fontSize: '25px', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '20px', textAlign: 'center'}}>
                Query History
            </Box>
            <DataGrid
                rows={queries}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                sx={{ border: 2, fontFamily:'monospace', borderColor:'white', color:'white', '& .header': {
                        backgroundColor: 'darkgray',
                        fontWeight: 'bold',
                    }}}
            />
        </Box>
    )
}