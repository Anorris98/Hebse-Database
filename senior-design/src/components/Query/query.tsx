import { useState } from 'react';
import { QueryInput } from "./QueryInput/QueryInput.tsx";
import { QueryResults } from './QueryResults/QueryResults';
import { QueryWelcomeText } from "../QueryWelcomeText/QueryWelcomeText.tsx";
import { SavedQueriesComponent } from "../SavedQueriesComponent/SavedQueriesComponent.tsx";
import { Grid2 } from "@mui/material";

export const Query = () => {
    const [queryResult, setQueryResult] = useState('');
    const [savedQueries, setSavedQueries] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    return (
        <div>
            {/* <NavBar/> The navigation bar */}
            <Grid2 display={"grid"} sx={{maxHeight: '1000px'}}>
                <QueryWelcomeText/>
                <QueryInput onQueryResult={setQueryResult}
                            savedQueries={savedQueries}
                            setSavedQueries={setSavedQueries}
                            inputValue={inputValue}
                            setInputValue={setInputValue}/> {/* Renders input box and updates query result via parent callback.*/}
                <SavedQueriesComponent savedQueries={savedQueries} setSavedQueries={setSavedQueries} setInputValue={setInputValue}/>
                <QueryResults queryResult={queryResult}/> {/* Displays the query result passed from the parent state.*/}
            </Grid2>
        </div>
    );
};
