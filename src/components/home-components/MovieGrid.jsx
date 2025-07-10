import React from 'react';
import MovieCard from "./MovieCard.jsx";

const MovieGrid = ({ isLoading, errorMessage, movieList }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-light-200 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (errorMessage) {
        return <p className="text-center py-8 text-red-400">{errorMessage}</p>;
    }

    return (
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movieList.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </ul>
    );
};

export default MovieGrid;