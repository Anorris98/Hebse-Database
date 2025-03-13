import {Box, TablePagination} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaginator = styled(TablePagination)(({}) => ({
  fontFamily: "monospace",
  color: "white",
  backgroundColor: "gray",
  border: "white 1px solid",
  borderRadius: "15px",
  "& .MuiTablePagination-select": {
    fontSize: "16px",
    fontFamily: "monospace",
  },
  "& .MuiTablePagination-selectLabel": {
    fontSize: "16px",
    fontFamily: "monospace"
  },
  "& .MuiTablePagination-menuItem": {
    fontSize: "100px",
    fontFamily: "monospace"
  },
  "& .MuiTablePagination-displayedRows": {
    fontSize: "16px",
    fontFamily: "monospace"
  }
}));

export const PageSelect = ({ setPageNumber, pageNumber, rows, rowsPerPage, setRowsPerPage }: { setPageNumber: (value: (((previousState: number) => number) | number)) => void, pageNumber: number, rows: number, rowsPerPage: number, setRowsPerPage: (value: (((previousState: number) => number) | number)) => void}) => {
  const handleChangePage = (
      _: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => {
      setPageNumber(newPage);
    };

  const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setRowsPerPage(Number.parseInt(event.target.value, 10));
      setPageNumber(0);
    };
  
  return <Box
    component="div"
    sx={{
      maxWidth: "lg",
      fontFamily: "monospace",
      marginTop: "20px",
      display: "flex",
      justifyContent: "flex-end"}}>
      <StyledPaginator rowsPerPage={rowsPerPage} labelRowsPerPage="Records Per Page" count={rows} page={pageNumber} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} slotProps={{
        select: {
          MenuProps: {
            PaperProps: {
              sx: {
                backgroundColor: "gray",
                color: "white"
              }
            }
          }
        },
        menuItem: {
          sx: {
            fontFamily: "monospace",
          }
        }
      }}/>
  </Box>
}