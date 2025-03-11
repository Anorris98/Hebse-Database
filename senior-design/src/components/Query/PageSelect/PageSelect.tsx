import { useState } from 'react';
import { TablePagination, Box } from "@mui/material";

export const PageSelect = ({ setPageNumber, pageNumber, rows, rowsPerPage, setRowsPerPage }: { setPageNumber: (value: (((prevState: number) => number) | number)) => void, pageNumber: number, rows: number, rowsPerPage: number, setRowsPerPage: (value: (((prevState: number) => number) | number)) => void}) => {
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
      ) => {
        setPageNumber(newPage);
      };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPageNumber(0);
      };
    
    return <Box
      component="div"
      sx={{
        maxWidth: 'lg',
        fontFamily: 'monospace',
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'flex-end'
    }}
    >
        <TablePagination rowsPerPage={rowsPerPage} labelRowsPerPage="Records Per Page" sx={{color: "black", backgroundColor: "white", borderRadius: "15px", borderColor: "black"}} count={rows} page={pageNumber} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>
    </Box>
}