import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router only once
import App from './app/routes'; // Ensure this matches your actual file path
import { NavBar } from './components/NavigationBar/NavBar'; // Import NavBar
import './index.css';

createRoot(document.getElementById('root')!).render(
    <Router>
        <NavBar /> {/* Ensure NavBar is always visible */}
        <App /> {/*Load all defined routes */}
    </Router>
);
