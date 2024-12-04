import React, { useState } from 'react';
import {NavBar} from "../NavigationBar/NavBar.tsx";
import {QueryInput} from "../QueryInput/QueryInput.tsx";
import { QueryResults } from '../QueryResults/QueryResults';

export const Query = () => {
    const [queryResult, setQueryResult] = useState<string>('');

    return (
        <div className="query">
            <NavBar />                                      {/*The navigation bar*/}
            <QueryInput onQueryResult={setQueryResult} />   {/* Renders input box and updates query result via parent callback.*/}
            <QueryResults queryResult={queryResult} />      {/* Displays the query result passed from the parent state.*/}
        </div>
    );
};