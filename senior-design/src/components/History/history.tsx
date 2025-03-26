import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {Box, IconButton} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";


async function downloadCSVFromHistory(id: number) {
    try{
        const response = await fetch('http://localhost:8000/exportData/id=' + id)
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const blob = await response.blob();
        const url = globalThis.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "query_" + id + ".csv";
        document.body.append(link);
        link.click();
        link.remove();
        globalThis.URL.revokeObjectURL(url);
    }
    catch(error){
        console.error("Error downloading data:", error);
    }
}

const renderDetailsButton = (params: { row: number; }) => {
    return (
        <strong>
            <IconButton children = {<DownloadIcon/>} sx={{color: 'white' }} onClick={() => downloadCSVFromHistory(params.row)}/>
        </strong>
    )
}

export const History = () => {
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Query ID', width: 100, headerClassName: 'header' },
        { field: 'name', headerName: 'Query', width: 640, headerClassName: 'header' },
        { field: 'datetime', headerName: 'Queried', width: 130, headerClassName: 'header' },
        { field: 'status', headerName: 'Status', width: 130, headerClassName: 'header' },
        { field: 'download', headerName: 'Download', width: 100, renderCell: renderDetailsButton, headerClassName: 'header'}
    ];

    const rows = [
        { id: 1, name: 'Query1', datetime: 'Jon', status: 35, download: "test" },
        { id: 2, name: 'Query2', datetime: 'Cersei', status: 42, download: "here" },
        { id: 3, name: 'Query3', datetime: 'Jaime', status: 45, download: "here" },
        { id: 4, name: 'Query4', datetime: 'Arya', status: 16, download: "here" },
        { id: 5, name: 'Query5', datetime: 'Daenerys', status: 16, download: "here" },
        { id: 6, name: 'Query6', datetime: 16, status: 150, download: "here" },
        { id: 7, name: 'Query7', datetime: 'Ferrara', status: 44 , download: "here"},
        { id: 8, name: 'Query8', datetime: 'Rossini', status: 36, download: "here" },
        { id: 9, name: 'Query9', datetime: 'Harvey', status: 65, download: "here" },
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
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                sx={{ border: 2, fontFamily:'monospace', borderColor:'white', color:'white', '& .header': {
                        backgroundColor: 'darkgray',
                        fontWeight: 'bold',
                    }, }}
            />
        </Box>
    )
}