import React, { useRef, useState, useEffect } from 'react';

const TrendingMoviesGallery = ({ trendingMovies }) => {
    const galleryRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Update button visibility on scroll
    useEffect(() => {
        const gallery = galleryRef.current;
        if (!gallery) return;

        const handleScroll = () => {
            setShowLeftButton(gallery.scrollLeft > 0);
            setShowRightButton(
                gallery.scrollLeft < gallery.scrollWidth - gallery.clientWidth - 1
            );
        };

        gallery.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => gallery.removeEventListener('scroll', handleScroll);
    }, [trendingMovies]);

    const scrollGallery = (direction) => {
        if (!galleryRef.current) return;
        const gallery = galleryRef.current;
        const scrollAmount = gallery.offsetWidth * (isMobile ? 0.75 : 0.5);

        direction === 'left'
            ? gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
            : gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    // Swipe handling for mobile
    const [touchStart, setTouchStart] = useState(0);
    const [touchPosition, setTouchPosition] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
        setTouchPosition(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (touchStart === 0) return;
        setTouchPosition(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchPosition > 50) {
            // Swipe left
            scrollGallery('right');
        } else if (touchStart - touchPosition < -50) {
            // Swipe right
            scrollGallery('left');
        }
        setTouchStart(0);
        setTouchPosition(0);
    };

    return (
        <section className="trending relative py-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Trending Now</h2>

            <div className="relative">
                <div
                    ref={galleryRef}
                    className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {trendingMovies.map((movie, index) => (
                        <div
                            key={`trending-${movie.$id}`}
                            className="group relative flex-shrink-0 transform transition-transform duration-300 hover:scale-105"
                        >
                            <div className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 fancy-text-sm">
                                {index + 1}
                            </div>
                            <img
                                src={movie.poster_url}
                                alt={movie.title}
                                className="w-[140px] h-[190px] sm:w-[180px] sm:h-[230px] object-cover rounded-lg shadow-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-3">
                                <h3 className="text-white font-bold truncate text-sm">{movie.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Side buttons - hidden on mobile */}
                {!isMobile && (
                    <>
                        {showLeftButton && (
                            <button
                                onClick={() => scrollGallery('left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center z-10 ml-2 transform transition-transform hover:scale-105 focus:outline-none"
                                aria-label="Scroll left"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                        {showRightButton && (
                            <button
                                onClick={() => scrollGallery('right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center z-10 mr-2 transform transition-transform hover:scale-105 focus:outline-none"
                                aria-label="Scroll right"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </>
                )}

                {/* Gradient overlays - visible only on desktop */}
                {!isMobile && (
                    <>
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-primary to-transparent pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-primary to-transparent pointer-events-none"></div>
                    </>
                )}
            </div>
        </section>
    );
};

export default TrendingMoviesGallery;