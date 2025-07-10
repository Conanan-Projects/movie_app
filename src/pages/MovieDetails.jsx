import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaImdb, FaGlobe, FaMoneyBillWave, FaCalendarAlt, FaClock, FaStar, FaFilm, FaLanguage, FaTheaterMasks, FaChartLine } from 'react-icons/fa';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    headers: { accept: 'application/json', Authorization: `Bearer ${API_KEY}` }
};

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [trailerKey, setTrailerKey] = useState(null);
    const [credits, setCredits] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch movie data
                const [movieRes, videosRes, creditsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS),
                    fetch(`${API_BASE_URL}/movie/${id}/videos`, API_OPTIONS),
                    fetch(`${API_BASE_URL}/movie/${id}/credits`, API_OPTIONS)
                ]);

                const dataMovie = await movieRes.json();
                setMovie(dataMovie);

                const videosData = await videosRes.json();
                const trailer = videosData.results.find(
                    v => v.type === 'Trailer' && v.site === 'YouTube'
                );
                setTrailerKey(trailer?.key || null);

                const creditsData = await creditsRes.json();
                setCredits(creditsData);
            } catch (err) {
                setError('Failed to load movie details.');
            }
        };
        fetchData();
    }, [id]);

    if (error) return <p className="text-center py-10 text-red-400">{error}</p>;
    if (!movie) return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-16 h-16 border-4 border-[#AB8BFF] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="wrapper">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 w-fit rounded-lg hover:underline flex items-center gap-2 text-light-200 cursor-pointer group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-[#AB8BFF] transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span className="group-hover:text-[#D6C7FF] transition-colors">Back to Movies</span>
            </button>

            <div className="bg-dark-100 p-5 sm:p-8 rounded-2xl shadow-inner shadow-light-100/10">
                {/* Movie header */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    <div className="relative flex-shrink-0">
                        <img
                            className="w-full lg:w-72 rounded-xl object-cover shadow-lg"
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                                    : '/No-Poster.png'
                            }
                            alt={movie.title}
                        />
                        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] w-14 h-14 rounded-full flex items-center justify-center text-primary font-bold text-xl shadow-lg">
                            {movie.vote_average.toFixed(1)}
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white">{movie.title}</h1>
                            {movie.imdb_id && (
                                <a
                                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#f5c518] text-black px-2 py-1 rounded flex items-center gap-1 text-sm font-bold hover:bg-yellow-400 transition-colors"
                                >
                                    <FaImdb className="text-lg" /> IMDb
                                </a>
                            )}
                        </div>

                        {movie.tagline && (
                            <p className="text-light-200 italic mb-4">"{movie.tagline}"</p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="flex items-center gap-1 text-light-200">
                                <FaCalendarAlt /> {movie.release_date?.slice(0, 4)}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-light-200"></div>
                            <span className="flex items-center gap-1 text-light-200">
                                <FaClock /> {movie.runtime} min
                            </span>
                            <div className="w-1 h-1 rounded-full bg-light-200"></div>
                            <span className="flex items-center gap-1 text-light-200">
                                <FaStar /> {movie.vote_average.toFixed(1)}/10
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {movie.genres?.map(genre => (
                                <span key={genre.id} className="px-3 py-1 bg-light-100/10 rounded-full text-light-200 text-sm flex items-center gap-1">
                                    <FaTheaterMasks className="text-[#AB8BFF]" /> {genre.name}
                                </span>
                            ))}
                        </div>

                        <p className="text-light-200 leading-relaxed mb-8">{movie.overview}</p>

                        {/* Quick stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-dark-200/50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-light-200 mb-1">
                                    <FaMoneyBillWave className="text-[#AB8BFF]" /> Budget
                                </div>
                                <div className="text-white font-medium">{formatCurrency(movie.budget)}</div>
                            </div>

                            <div className="bg-dark-200/50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-light-200 mb-1">
                                    <FaChartLine className="text-[#AB8BFF]" /> Revenue
                                </div>
                                <div className="text-white font-medium">{formatCurrency(movie.revenue)}</div>
                            </div>

                            <div className="bg-dark-200/50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-light-200 mb-1">
                                    <FaLanguage className="text-[#AB8BFF]" /> Language
                                </div>
                                <div className="text-white font-medium">{movie.original_language.toUpperCase()}</div>
                            </div>

                            <div className="bg-dark-200/50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-light-200 mb-1">
                                    <FaFilm className="text-[#AB8BFF]" /> Status
                                </div>
                                <div className="text-white font-medium">{movie.status}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-light-100/20 mb-6">
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'details'
                                ? 'text-[#D6C7FF] border-b-2 border-[#AB8BFF]'
                                : 'text-light-200 hover:text-[#D6C7FF]'
                        }`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'trailer'
                                ? 'text-[#D6C7FF] border-b-2 border-[#AB8BFF]'
                                : 'text-light-200 hover:text-[#D6C7FF]'
                        }`}
                        onClick={() => setActiveTab('trailer')}
                    >
                        Trailer
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'cast'
                                ? 'text-[#D6C7FF] border-b-2 border-[#AB8BFF]'
                                : 'text-light-200 hover:text-[#D6C7FF]'
                        }`}
                        onClick={() => setActiveTab('cast')}
                    >
                        Cast & Crew
                    </button>
                </div>

                {/* Tab content */}
                {activeTab === 'details' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-dark-200/50 p-5 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#AB8BFF]" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
                                </svg>
                                Production Companies
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {movie.production_companies?.map(company => (
                                    <div key={company.id} className="flex items-center gap-2 bg-dark-100 p-3 rounded-lg">
                                        {company.logo_path ? (
                                            <div className="bg-white p-2 rounded flex items-center justify-center">
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                                    alt={company.name}
                                                    className="h-10 object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-light-200" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                        <span className="text-light-200">{company.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Production Countries */}
                        <div className="bg-dark-200/50 p-5 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <FaGlobe className="text-[#AB8BFF]" /> Production Countries
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {movie.production_countries?.map(country => (
                                    <span key={country.iso_3166_1} className="px-3 py-2 bg-dark-100 rounded-lg text-light-200">
                                        {country.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-dark-200/50 p-5 rounded-xl md:col-span-2">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                Additional Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <h4 className="text-light-200 mb-2">Original Title</h4>
                                    <p className="text-white">{movie.original_title}</p>
                                </div>
                                <div>
                                    <h4 className="text-light-200 mb-2">Release Date</h4>
                                    <p className="text-white">{new Date(movie.release_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h4 className="text-light-200 mb-2">Spoken Languages</h4>
                                    <p className="text-white">
                                        {movie.spoken_languages?.map(lang => lang.english_name).join(', ')}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-light-200 mb-2">Homepage</h4>
                                    {movie.homepage ? (
                                        <a
                                            href={movie.homepage}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#D6C7FF] hover:underline"
                                        >
                                            Visit Website
                                        </a>
                                    ) : (
                                        <p className="text-light-200">N/A</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'trailer' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#AB8BFF]" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            Official Trailer
                        </h3>

                        {trailerKey ? (
                            <div className="aspect-video rounded-xl overflow-hidden shadow-lg border border-light-100/10">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${trailerKey}`}
                                    title={`${movie.title} trailer`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 bg-dark-200/50 rounded-xl border border-light-100/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-light-200 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 5.25v13.5A2.25 2.25 0 006.75 21h6.75a2.25 2.25 0 002.25-2.25v-3.75m0-6l5.25-3v12l-5.25-3" />
                                    <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
                                </svg>
                                <p className="text-light-100 mt-4 text-center max-w-md">
                                    No official trailer available for this movie
                                </p>
                                <p className="text-light-200 text-sm mt-2 text-center">
                                    We couldn't find a trailer for this title
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'cast' && credits && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Cast</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                            {credits.cast.slice(0, 10).map(person => (
                                <div key={person.id} className="bg-dark-200/50 rounded-lg overflow-hidden">
                                    {person.profile_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                                            alt={person.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="bg-gray-700 w-full h-48 flex items-center justify-center">
                                            <FaTheaterMasks className="text-4xl text-light-200" />
                                        </div>
                                    )}
                                    <div className="p-3">
                                        <h4 className="text-white font-medium">{person.name}</h4>
                                        <p className="text-light-200 text-sm">{person.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-4">Crew</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {credits.crew
                                .filter(person => ['Director', 'Producer', 'Screenplay', 'Writer'].includes(person.job))
                                .slice(0, 8)
                                .map(person => (
                                    <div key={person.id} className="flex items-center gap-3 bg-dark-200/50 p-3 rounded-lg">
                                        {person.profile_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                                                alt={person.name}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center">
                                                <FaTheaterMasks className="text-xl text-light-200" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-white font-medium">{person.name}</h4>
                                            <p className="text-light-200 text-sm">{person.job}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;