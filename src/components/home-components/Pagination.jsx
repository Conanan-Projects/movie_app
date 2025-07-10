import React, { useCallback, useRef } from 'react';

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    const scrollAttemptRef = useRef(0);

    const MAX_TMDB_PAGES = 500;
    const safeTotalPages = Math.min(totalPages, MAX_TMDB_PAGES);

    const handlePageChange = useCallback((newPage) => {
        if (newPage === currentPage) return;

        setCurrentPage(newPage);
        scrollAttemptRef.current = 0;
        attemptScrollToMovies();
    }, [currentPage, setCurrentPage]);

    const attemptScrollToMovies = useCallback(() => {
        const moviesElement = document.getElementById('movies');

        if (moviesElement) {
            moviesElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            scrollAttemptRef.current = 0;
        } else if (scrollAttemptRef.current < 5) {
            scrollAttemptRef.current += 1;
            setTimeout(attemptScrollToMovies, 200 * scrollAttemptRef.current);
        }
    }, []);

    const getDesktopPageNumbers = () => {
        const pages = [];
        const pageLimit = 5;
        const half = Math.floor(pageLimit / 2);

        let start = Math.max(1, currentPage - half);
        let end = Math.min(safeTotalPages, start + pageLimit - 1);

        if (end - start < pageLimit - 1) {
            start = Math.max(1, end - pageLimit + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const getMobilePageNumbers = () => {
        if (safeTotalPages <= 3) {
            return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
        }

        const pages = [];

        pages.push(currentPage);

        if (currentPage > 1) {
            pages.unshift(currentPage - 1);
        }

        if (currentPage < safeTotalPages) {
            pages.push(currentPage + 1);
        }

        if (currentPage > 2) {
            pages.unshift('...');
        }

        if (currentPage < safeTotalPages - 1) {
            pages.push('...');
        }

        return pages;
    };

    const desktopPages = getDesktopPageNumbers();
    const mobilePages = getMobilePageNumbers();

    return (
        <div className="pagination mt-10 flex items-center justify-center gap-2 sm:gap-3">
            {/* First Page Button (<<) */}
            <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-dark-100 text-light-200 rounded-lg flex items-center gap-1 sm:gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-light-100/10 cursor-pointer text-sm sm:text-base"
                aria-label="First page"
            >
                <span className="sm:hidden">≪</span>
                <span className="hidden sm:inline">First</span>
            </button>

            {/* Previous Page Button (<) */}
            <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-dark-100 text-light-200 rounded-lg flex items-center gap-1 sm:gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-light-100/10 cursor-pointer text-sm sm:text-base"
                aria-label="Previous page"
            >
                <span className="sm:hidden">‹</span>
                <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Desktop Page Numbers */}
            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                {desktopPages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all text-xs sm:text-base ${
                            currentPage === page
                                ? 'bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-primary font-bold'
                                : 'bg-dark-100 text-light-200 hover:bg-light-100/10 cursor-pointer'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Mobile Page Numbers */}
            <div className="flex sm:hidden items-center gap-1 sm:gap-2">
                {mobilePages.map((page, index) => (
                    typeof page === 'number' ? (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-7 h-7 flex items-center justify-center rounded-full transition-all text-xs ${
                                currentPage === page
                                    ? 'bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-primary font-bold'
                                    : 'bg-dark-100 text-light-200 hover:bg-light-100/10 cursor-pointer'
                            }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={`ellipsis-${index}`} className="px-2 text-light-200">
                            ...
                        </span>
                    )
                ))}
            </div>

            {/* Next Page Button (>) */}
            <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, safeTotalPages))}
                disabled={currentPage === safeTotalPages}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-dark-100 text-light-200 rounded-lg flex items-center gap-1 sm:gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-light-100/10 cursor-pointer text-sm sm:text-base"
                aria-label="Next page"
            >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">›</span>
            </button>

            {/* Last Page Button (>>) */}
            <button
                onClick={() => handlePageChange(safeTotalPages)}
                disabled={currentPage === safeTotalPages}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-dark-100 text-light-200 rounded-lg flex items-center gap-1 sm:gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-light-100/10 cursor-pointer text-sm sm:text-base"
                aria-label="Last page"
            >
                <span className="hidden sm:inline">Last</span>
                <span className="sm:hidden">≫</span>
            </button>
        </div>
    );
};

export default Pagination;
