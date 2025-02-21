import { useState } from 'react';
import { QueryInput } from "../QueryInput/QueryInput.tsx";
import { QueryResults } from '../QueryResults/QueryResults';
import { QueryWelcomeText } from "../QueryWelcomeText/QueryWelcomeText.tsx";
import { SavedQueriesComponent } from "../SavedQueriesComponent/SavedQueriesComponent.tsx";
import { Grid2 } from "@mui/material";

export const Query = () => {
    const [queryResult, setQueryResult] = useState('');
    const [savedQueries, setSavedQueries] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    return (
        <Grid2 display={"grid"} sx={{ maxHeight: '1000px' }}>
            <QueryWelcomeText />
            <QueryInput 
                onQueryResult={setQueryResult}
                setSavedQueries={setSavedQueries}
                inputValue={inputValue}
                setInputValue={setInputValue}
            />
            <SavedQueriesComponent 
                savedQueries={savedQueries} 
                setSavedQueries={setSavedQueries} 
                setInputValue={setInputValue}
            />
            <QueryResults queryResult={queryResult} />
        </Grid2>
    );
};
