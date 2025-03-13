import {Route, Routes} from 'react-router-dom';
import {ErrorPage} from "../components/ErrorPage/error-page.tsx";
import {Query} from "../components/Query/query.tsx";
import {Utilities} from "../components/Utilities/utilities.tsx";
import {AboutUs} from "../components/About_Us/about-us.tsx";
import {Settings} from "../components/Settings/settings.tsx";
import {History} from "../components/History/history.tsx";

const App = () => {
    return (
        <Routes>
            <Route path='/' element={<Query/>}/>
            <Route path='/Settings' element={<Settings/>}/>
            <Route path='/History' element={<History/>}/>
            <Route path='/Utilities' element={<Utilities/>}/>
            <Route path='/About_Us' element={<AboutUs/>}/>
            <Route path='*' element={<ErrorPage/>}/>
        </Routes>
    )
};

export default App;
