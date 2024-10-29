import {Routes, Route} from 'react-router-dom';

import Home from '../components/Home/home.tsx';
import {ErrorPage} from "../components/ErrorPage/error-page.tsx";
import {Query} from "../components/Query/query.tsx";

const App = () => {
    return (
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='*' element={<ErrorPage/>}/>
            <Route path='/query' element={<Query/>}/>
        </Routes>
    )
};

export default App;
