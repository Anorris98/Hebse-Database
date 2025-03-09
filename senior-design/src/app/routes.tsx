import {Route, Routes} from 'react-router-dom';
import {ErrorPage} from "../components/ErrorPage/error-page.tsx";
import {Query} from "../components/Query/query.tsx";
import {Utilities} from "../components/Utilities/Utilities.tsx";
import {About_Us} from "../components/About_Us/About_Us.tsx";
import {Settings} from "../components/Settings/Settings.tsx";
import {History} from "../components/History/History.tsx";

const App = () => {
    return (
        <Routes>
            <Route path='/' element={<Query/>}/>
            <Route path='/Settings' element={<Settings/>}/>
            <Route path='/History' element={<History/>}/>
            <Route path='/Utilities' element={<Utilities/>}/>
            <Route path='/About_Us' element={<About_Us/>}/>
            <Route path='*' element={<ErrorPage/>}/>
        </Routes>
    )
};

export default App;
