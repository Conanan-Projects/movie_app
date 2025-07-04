import {useState, useEffect} from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

    const [movieList, setMovieList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [trendingMovies, setTrendingMovies] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageLimit = 5;



    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

    const fetchMovies = async (query = '', page = 1) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();

            if (data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
            }

            setMovieList(data.results || []);
            setTotalPages(data.total_pages);  // 👈 TMDB provides this

            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.log(`Error Fetching Movies: ${error}`);
            setErrorMessage('Error Fetching Movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };


    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();

            setTrendingMovies(movies);
        } catch (error){
            console.error(`Error fetching trending movies: ${error}`);
        }
    }

    const getPageNumbers = () => {
        const half = Math.floor(pageLimit / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + pageLimit - 1);

        // Shift window if we're near the end
        if (end - start < pageLimit - 1) {
            start = Math.max(1, end - pageLimit + 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };


    useEffect(() => {
        fetchMovies(debouncedSearchTerm, currentPage);
    }, [debouncedSearchTerm, currentPage]);

    useEffect(() => {
        setCurrentPage(1); // 👈 reset to first page on new search
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies()
    }, []);

    useEffect(() => {
        const section = document.querySelector('.all-movies');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }, [currentPage]);




    return (
        <main>
            <div className="pattern" />

            <div className="wrapper">
                <header>
                    {/*<img src="./logo.png" alt="Logo" className="w-16 h-16"/>*/}
                    <img src="./hero-img.png" alt="Hero Banner"/>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingMovies.length >0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>

                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url} alt={movie.title}/>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="all-movies">
                    <h2>All Movies</h2>

                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map(movie => (
                                <MovieCard key = {movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}

                    {!isLoading && !errorMessage && movieList.length > 0 && (
                        <div className="pagination mt-4 flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-purple-800 text-purple-200 border border-purple-800 rounded disabled:opacity-50 cursor-pointer"
                            >
                                &lt;
                            </button>

                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 border rounded transition-colors duration-150 cursor-pointer ${
                                        currentPage === page
                                            ? 'bg-purple-800 text-purple-400 border-2 font-semibold'
                                            : 'bg-purple-800 text-purple-200 border-purple-800 hover:bg-purple-900'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-purple-800 text-purple-200 border border-purple-800 rounded disabled:opacity-50 cursor-pointer"
                            >
                                &gt;
                            </button>
                        </div>
                    )}

                </section>
            </div>
        </main>
    )
}

export default App;