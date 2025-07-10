import React from 'react';

const SORT_OPTIONS = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'vote_average', label: 'Rating' },
    { value: 'revenue', label: 'Box Office' },
    { value: 'primary_release_date', label: 'Release Date' },
    { value: 'original_title', label: 'Title' },
    { value: 'vote_count', label: 'Vote Count' },
];

const SortingControls = ({
                             sortField,
                             setSortField,
                             sortDirection,
                             toggleSortDirection
                         }) => {
    return (
        <div className="flex items-center gap-2">
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

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-light-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default SortingControls;