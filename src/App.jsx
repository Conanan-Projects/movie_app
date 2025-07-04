import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // This is what you currently call App's main content
import MovieDetails from './pages/MovieDetails';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
