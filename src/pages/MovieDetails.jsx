import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Movie data
                const resMovie = await fetch(
                    `${API_BASE_URL}/movie/${id}`,
                    API_OPTIONS
                );
                const dataMovie = await resMovie.json();
                setMovie(dataMovie);

                // Trailer
                const resVid = await fetch(
                    `${API_BASE_URL}/movie/${id}/videos`,
                    API_OPTIONS
                );
                const { results } = await resVid.json();
                const trailer = results.find(
                    (v) => v.type === 'Trailer' && v.site === 'YouTube'
                );
                setTrailerKey(trailer?.key || null);
            } catch (err) {
                setError('Failed to load movie details.');
            }
        };
        fetchData();
    }, [id]);

    if (error) return <p className="text-center py-10 text-red-400">{error}</p>;
    if (!movie) return <p className="text-center py-10 text-light-200">Loading…</p>;

    return (
        <div className="wrapper">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 px-5 py-3 rounded-lg bg-light-100/10 hover:bg-light-100/20 transition-all duration-300 flex items-center gap-2 text-light-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Movies
            </button>

            <div className="bg-dark-100 p-5 sm:p-8 rounded-2xl shadow-inner shadow-light-100/10 flex flex-col lg:flex-row gap-8">
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
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{movie.title}</h1>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="text-light-200">{movie.release_date?.slice(0, 4)}</span>
                        <div className="w-1 h-1 rounded-full bg-light-200"></div>
                        <span className="text-light-200">{movie.runtime} min</span>
                        <div className="w-1 h-1 rounded-full bg-light-200"></div>
                        <div className="flex flex-wrap gap-2">
                            {movie.genres?.map(genre => (
                                <span key={genre.id} className="px-3 py-1 bg-light-100/10 rounded-full text-light-200 text-sm">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="text-light-200 leading-relaxed mb-8">{movie.overview}</p>

                    {/* Trailer Section */}
                    <div className="mt-8">
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
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;