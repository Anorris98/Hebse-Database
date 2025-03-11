import { useState } from 'react';
import { QueryInput } from "./QueryInput/QueryInput.tsx";
import { QueryResults } from './QueryResults/QueryResults';
import { QueryWelcomeText } from "../QueryWelcomeText/QueryWelcomeText.tsx";
import { SavedQueriesComponent } from "../SavedQueriesComponent/SavedQueriesComponent.tsx";
import { PageSelect } from "./PageSelect/PageSelect.tsx";
import { Grid2 } from "@mui/material";
import NLPInteraction from "./NLPInteraction/NLPInteraction.tsx";

export const Query = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [queryResult, setQueryResult] = useState('');
    const [savedQueries, setSavedQueries] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(50);

    return (
        <div>
            {/* <NavBar/> The navigation bar */}
            <Grid2 display={"grid"} sx={{maxHeight: '1000px'}}>
                <QueryWelcomeText/>
                <NLPInteraction />{/* Displays the NPLInteraction component*/}
                <QueryInput onQueryResult={setQueryResult}
                            savedQueries={savedQueries}
                            setSavedQueries={setSavedQueries}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            setPageNumber={setPageNumber}/> {/* Renders input box and updates query result via parent callback.*/}
                <SavedQueriesComponent savedQueries={savedQueries} setSavedQueries={setSavedQueries} setInputValue={setInputValue}/>
                <PageSelect setPageNumber={setPageNumber}
                            pageNumber={pageNumber}
                            rows={queryResult.length}
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}/>
                <QueryResults queryResult={queryResult.slice(pageNumber * rowsPerPage, pageNumber * rowsPerPage + rowsPerPage)}/> {/* Displays the query result passed from the parent state.*/}
            </Grid2>
        </div>
    );
};
