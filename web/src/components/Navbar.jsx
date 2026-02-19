import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="bg-blue-600 text-white p-4 sticky top-0 z-50 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold tracking-tight" onClick={closeMenu}>
                    Book Store
                </Link>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden p-2 focus:outline-none"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            <span className="text-sm font-medium opacity-90">Hi, {user.username}</span>
                            <Link to="/add-listing" className="hover:text-blue-100 transition">Add Listing</Link>
                            <Link to="/my-listings" className="hover:text-blue-100 transition">My Listings</Link>
                            <Link to="/my-orders" className="hover:text-blue-100 transition">My Purchases</Link>
                            <Link to="/favorites" className="hover:text-blue-100 transition">Favorites</Link>
                            <button
                                onClick={logout}
                                className="bg-white text-blue-600 px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-blue-50 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-100 transition">Login</Link>
                            <Link to="/register" className="bg-white text-blue-600 px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-blue-50 transition">Register</Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t border-blue-500 pt-4 flex flex-col gap-4">
                    {user ? (
                        <>
                            <div className="px-2 py-1 bg-blue-700 rounded text-sm mb-2">Logged in as {user.username}</div>
                            <Link to="/add-listing" className="px-2 py-1 hover:bg-blue-700 rounded transition" onClick={closeMenu}>Add Listing</Link>
                            <Link to="/my-listings" className="px-2 py-1 hover:bg-blue-700 rounded transition" onClick={closeMenu}>My Listings</Link>
                            <Link to="/my-orders" className="px-2 py-1 hover:bg-blue-700 rounded transition" onClick={closeMenu}>My Purchases</Link>
                            <Link to="/favorites" className="px-2 py-1 hover:bg-blue-700 rounded transition" onClick={closeMenu}>Favorites</Link>
                            <button
                                onClick={() => { logout(); closeMenu(); }}
                                className="text-left px-2 py-1 hover:bg-blue-700 rounded transition font-bold text-red-100"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-2 py-1 hover:bg-blue-700 rounded transition" onClick={closeMenu}>Login</Link>
                            <Link to="/register" className="px-2 py-1 hover:bg-blue-700 rounded transition" onClick={closeMenu}>Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

