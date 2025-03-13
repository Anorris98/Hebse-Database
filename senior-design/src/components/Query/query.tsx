import { useState } from 'react';
import { QueryInput } from "./QueryInput/query-input.tsx";
import { QueryResult } from './QueryResults/query-result.tsx';
import { QueryWelcomeText } from "../QueryWelcomeText/query-welcome-text.tsx";
import { SavedQueriesComponent } from "../SavedQueriesComponent/saved-queries-component.tsx";
import { Grid2 } from "@mui/material";
import NlpInteractions from "./NLPInteraction/nlp-interactions.tsx";

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
                <NlpInteractions />{/* Displays the NPLInteraction component*/}
                <QueryInput onQueryResult={setQueryResult}
                            savedQueries={savedQueries}
                            setSavedQueries={setSavedQueries}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            setPageNumber={setPageNumber}/> {/* Renders input box and updates query result via parent callback.*/}
                <SavedQueriesComponent savedQueries={savedQueries} setSavedQueries={setSavedQueries} setInputValue={setInputValue}/>
                <QueryResult queryResult={queryResult.slice(pageNumber * rowsPerPage, pageNumber * rowsPerPage + rowsPerPage)}
                             setPageNumber={setPageNumber}
                             pageNumber={pageNumber}
                             totalEntries={queryResult.length}
                             rowsPerPage={rowsPerPage}
                             setRowsPerPage={setRowsPerPage}/> {/* Displays the query result passed from the parent state.*/}
            </Grid2>
        </div>
    );
};
