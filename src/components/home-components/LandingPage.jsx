import React from 'react';
import Search from '../Search';

const LandingPage = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero min-h-screen relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/60 z-0"></div>
                <div className="absolute inset-0 bg-pattern z-0 opacity-10"></div>

                <div className="container mx-auto relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
                    <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-6 max-w-4xl">
                        Discover Your Next <span className="text-gradient">Favorite Movie</span>
                    </h1>
                    <p className="text-xl text-light-200 text-center mb-10 max-w-2xl">
                        Explore thousands of movies, find ratings, reviews, and recommendations. All in one place.
                    </p>

                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                    <div className="flex flex-wrap gap-4 justify-center">
                        <a
                            href="#movies"
                            className="px-8 py-3 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-dark-900 font-bold rounded-full hover:opacity-90 transition-all cursor-pointer"
                        >
                            Explore Movies
                        </a>
                        <a
                            href="#trending"
                            className="px-8 py-3 bg-transparent border-2 border-[#AB8BFF] text-[#AB8BFF] font-bold rounded-full hover:bg-[#AB8BFF]/10 transition-all"
                        >
                            See Trending
                        </a>

                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-16 bg-dark-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">Popular Categories</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Action & Adventure", count: "1,240 movies", color: "from-red-500/20 to-red-800/10" },
                            { title: "Sci-Fi & Fantasy", count: "980 movies", color: "from-blue-500/20 to-blue-800/10" },
                            { title: "Drama", count: "2,150 movies", color: "from-purple-500/20 to-purple-800/10" },
                            { title: "Comedy", count: "1,780 movies", color: "from-yellow-500/20 to-yellow-800/10" },
                        ].map((category, index) => (
                            <div
                                key={index}
                                className={`bg-gradient-to-br ${category.color} border border-light-100/10 rounded-xl p-6 backdrop-blur-sm hover:translate-y-[-5px] transition-all duration-300 cursor-pointer`}
                            >
                                <h3 className="text-xl font-bold text-white mb-3">{category.title}</h3>
                                <p className="text-light-200">{category.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;