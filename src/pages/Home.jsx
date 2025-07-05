import {useState, useEffect, useRef } from "react";
import Search from "../components/Search.jsx";
import Spinner from "../components/Spinner.jsx";
import MovieCard from "../components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "../appwrite.js";

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
    const [sortField, setSortField] = useState('popularity'); // Sort field only
    const [sortDirection, setSortDirection] = useState('desc'); // asc or desc
    const pageLimit = 5;
    const galleryRef = useRef(null);

    // Sorting options - now without direction
    const SORT_OPTIONS = [
        { value: 'popularity', label: 'Popularity' },
        { value: 'vote_average', label: 'Rating' },
        { value: 'revenue', label: 'Box Office' },
        { value: 'primary_release_date', label: 'Release Date' },
        { value: 'original_title', label: 'Title' },
        { value: 'vote_count', label: 'Vote Count' },
    ];

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

    const fetchMovies = async (query = '', page = 1) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            let endpoint;
            if (query) {
                endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`;
            } else {
                // Combine sort field and direction
                const sortBy = `${sortField}.${sortDirection}`;
                endpoint = `${API_BASE_URL}/discover/movie?sort_by=${sortBy}&page=${page}&vote_count.gte=100`;
            }

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
            setTotalPages(data.total_pages);

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

    const scrollGallery = (direction) => {
        if (!galleryRef.current) return;
        const gallery = galleryRef.current;
        const scrollAmount = gallery.offsetWidth * 0.8;
        direction === 'left'
            ? gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
            : gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        const half = Math.floor(pageLimit / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + pageLimit - 1);

        if (end - start < pageLimit - 1) {
            start = Math.max(1, end - pageLimit + 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

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
        loadTrendingMovies()
    }, []);

    useEffect(() => {
        const section = document.querySelector('.all-movies');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }, [currentPage]);

    return (
        <main className="relative z-10">
            <div className="wrapper">
                <header className="mb-12">
                    <h1 className="mb-6">
                        Watch <span className="text-gradient">Movies</span> Smarter, Not Harder
                    </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending relative">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">Trending Now</h2>
                            <div className="flex items-center gap-3 text-light-200">
                                <button
                                    onClick={() => scrollGallery('left')}
                                    className="p-2 rounded-full bg-dark-100 hover:bg-light-100/10 transition-colors cursor-pointer"
                                    aria-label="Scroll left"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => scrollGallery('right')}
                                    className="p-2 rounded-full bg-dark-100 hover:bg-light-100/10 transition-colors cursor-pointer"
                                    aria-label="Scroll right"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="CurrentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div
                                ref={galleryRef}
                                className="flex gap-6 overflow-x-hidden"
                            >
                                {trendingMovies.map((movie, index) => (
                                    <div
                                        key={`trending-${movie.$id}`}
                                        className="group relative flex-shrink-0 transform transition-transform duration-300 hover:scale-105"
                                    >
                                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 fancy-text-sm">
                                            {index + 1}
                                        </div>
                                        <img
                                            src={movie.poster_url}
                                            alt={movie.title}
                                            className="w-[180px] h-[230px] object-cover rounded-lg shadow-lg"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-3">
                                            <h3 className="text-white font-bold truncate text-sm">{movie.title}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-primary to-transparent pointer-events-none"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-primary to-transparent pointer-events-none"></div>
                        </div>
                    </section>
                )}

                <section className="all-movies mt-16">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">All Movies</h2>

                        {/* Sorting Controls */}
                        <div className="flex items-center gap-2">
                            {/* Direction Toggle Button */}
                            <button
                                onClick={toggleSortDirection}
                                className="p-2 rounded-lg bg-dark-100 hover:bg-light-100/10 transition-colors flex items-center justify-center"
                                aria-label={`Sort direction: ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
                                title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
                            >
                                {sortDirection === 'asc' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-200" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-200" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>

                            {/* Field Dropdown */}
                            <div className="relative">
                                <select
                                    value={sortField}
                                    onChange={(e) => setSortField(e.target.value)}
                                    className="appearance-none bg-dark-100 text-light-200 border border-light-100/20 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#AB8BFF]"
                                >
                                    {SORT_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                {/* Custom dropdown arrow */}
                                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-light-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-12 h-12 border-4 border-light-200 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : errorMessage ? (
                        <p className="text-center py-8 text-red-400">{errorMessage}</p>
                    ) : (
                        <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {movieList.map(movie => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}

                    {!isLoading && !errorMessage && movieList.length > 0 && (
                        <div className="pagination mt-10 flex flex-wrap items-center justify-center gap-3">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-dark-100 text-light-200 rounded-lg flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-light-100/10 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Prev
                            </button>

                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                                        currentPage === page
                                            ? 'bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-primary font-bold'
                                            : 'bg-dark-100 text-light-200 hover:bg-light-100/10 cursor-pointer'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-dark-100 text-light-200 rounded-lg flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-light-100/10 cursor-pointer"
                            >
                                Next
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
};

export default Home;