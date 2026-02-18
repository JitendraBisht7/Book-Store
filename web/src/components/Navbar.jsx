import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">MarketPlace</Link>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span>Hello, {user.username}</span>
                            <Link to="/add-listing" className="hover:underline">Add Listing</Link>
                            <Link to="/my-listings" className="hover:underline">My Listings</Link>
                            <Link to="/my-orders" className="hover:underline">My Purchases</Link>
                            <Link to="/favorites" className="hover:underline">Favorites</Link>
                            <button onClick={logout} className="hover:underline">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/register" className="hover:underline">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
