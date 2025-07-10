import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="w-full max-w-2xl mb-12">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for movies, actors, directors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-4 px-6 bg-dark-100/70 backdrop-blur-sm border border-light-100/20 rounded-full text-light-200 focus:outline-none focus:ring-2 focus:ring-[#AB8BFF]"
                />
                <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] rounded-full px-6 py-2.5 text-dark-900 font-bold cursor-pointer "
                    onClick={() => console.log('Search triggered:', searchTerm)}
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default Search;
