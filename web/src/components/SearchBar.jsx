import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [term, setTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(term);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 flex shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden border border-gray-200">
            <input
                type="text"
                placeholder="Search books by title..."
                className="flex-grow px-4 py-3 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 bg-white text-gray-800 placeholder-gray-400"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-5 md:px-8 py-3 font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
                <span className="hidden md:inline">Search</span>
                <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </form>
    );
};

export default SearchBar;
