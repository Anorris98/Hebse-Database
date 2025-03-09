import {DataGrid, GridColDef} from '@mui/x-data-grid';

export const History = () => {
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Query ID', width: 70 },
        { field: 'name', headerName: 'Query', width: 130 },
        { field: 'datetime', headerName: 'Queried', width: 130 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'download', headerName: 'Download', width: 130 }
    ];

    const rows = [
        { id: 1, name: 'Snow', datetime: 'Jon', status: 35, download: "here" },
        { id: 2, name: 'Lannister', datetime: 'Cersei', status: 42, download: "here" },
        { id: 3, name: 'Lannister', datetime: 'Jaime', status: 45, download: "here" },
        { id: 4, name: 'Stark', datetime: 'Arya', status: 16, download: "here" },
        { id: 5, name: 'Targaryen', datetime: 'Daenerys', status: null, download: "here" },
        { id: 6, name: 'Melisandre', datetime: null, status: 150, download: "here" },
        { id: 7, name: 'Clifford', datetime: 'Ferrara', status: 44 , download: "here"},
        { id: 8, name: 'Frances', datetime: 'Rossini', status: 36, download: "here" },
        { id: 9, name: 'Roxie', datetime: 'Harvey', status: 65, download: "here" },
    ];

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <div>
        {/* Add history components here*/}
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0, color: 'white', backgroundColor: 'darkgray'}}
            />
        </div>
    )
}