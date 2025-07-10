import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie: { id, title, vote_average, poster_path, release_date, original_language } }) => {
    const navigate = useNavigate();

    return (
        <div
            className="movie-card group cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_25px_-5px_rgba(171,139,255,0.3)]"
            onClick={() => navigate(`/movie/${id}`)}
        >
            <div className="relative overflow-hidden rounded-lg aspect-[2/3]">
                <img
                    src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/No-Poster.png'}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-full py-2 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-primary font-bold rounded-lg cursor-pointer text-xs sm:text-sm">
                        View Details
                    </button>
                </div>
            </div>

            <div className="mt-3">
                <h3 className="group-hover:text-[#D6C7FF] transition-colors duration-300 text-sm sm:text-base line-clamp-1">{title}</h3>
                <div className="content mt-2 flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <div className="rating flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD700]" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <p className="font-bold text-white">{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>
                    <span className="text-light-200">•</span>
                    <p className="lang text-light-200 uppercase">{original_language}</p>
                    <span className="text-light-200">•</span>
                    <p className="year text-light-200">
                        {release_date ? release_date.split('-')[0] : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;