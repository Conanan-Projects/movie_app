import { useState, useEffect } from "react";
import Search from "../components/Search.jsx";
import TrendingMoviesGallery from "../components/home-components/TrendingMoviesGallery.jsx";
import SortingControls from "../components/home-components/SortingControls.jsx";
import MovieGrid from "../components/home-components/MovieGrid.jsx";
import Pagination from "../components/home-components/Pagination.jsx";
import LandingPage from "../components/home-components/LandingPage.jsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "../appwrite.js";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    }
}

const Home = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [movieList, setMovieList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [trendingMovies, setTrendingMovies] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('popularity');
    const [sortDirection, setSortDirection] = useState('desc');

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

    const fetchMovies = async (query = '', page = 1) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            let endpoint;
            if (query) {
                endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`;
            } else {
                const sortBy = `${sortField}.${sortDirection}`;
                endpoint = `${API_BASE_URL}/discover/movie?sort_by=${sortBy}&page=${page}&vote_count.gte=100`;
            }

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) throw new Error('Failed to fetch movies');

            const data = await response.json();
            if (data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
            }

            setMovieList(data.results || []);
            setTotalPages(data.total_pages);

            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.error(`Error Fetching Movies: ${error}`);
            setErrorMessage('Error Fetching Movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        } catch (error) {
            console.error(`Error fetching trending movies: ${error}`);
        }
    }

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    useEffect(() => {
        fetchMovies(debouncedSearchTerm, currentPage);
    }, [debouncedSearchTerm, currentPage, sortField, sortDirection]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, sortField, sortDirection]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);

    return (
        <main className="relative z-10">
            <LandingPage searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <div className="wrapper">

                {trendingMovies.length > 0 && (
                    <div id="trending">
                        <TrendingMoviesGallery trendingMovies={trendingMovies} />
                    </div>
                )}


                <section className="all-movies mt-16" id="movies">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">All Movies</h2>
                        <SortingControls
                            sortField={sortField}
                            setSortField={setSortField}
                            sortDirection={sortDirection}
                            toggleSortDirection={toggleSortDirection}
                        />
                    </div>

                    <MovieGrid
                        isLoading={isLoading}
                        errorMessage={errorMessage}
                        movieList={movieList}
                    />

                    {!isLoading && !errorMessage && movieList.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                </section>
            </div>
        </main>
    )
};

export default Home;