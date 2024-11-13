import {NavBar} from "../NavigationBar/NavBar.tsx";
import {QueryInput} from "../QueryInput/QueryInput.tsx";

export const Query = () => {

    return (
        <div className='query'>
            <NavBar/>
            <QueryInput/>
        </div>
    );
};