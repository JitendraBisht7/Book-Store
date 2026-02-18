import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const MyListingsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchMyListings = async () => {
            try {
                const res = await api.get('/products/my');
                setListings(res.data);
            } catch (err) {
                console.error('Failed to fetch listings', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyListings();
    }, [user, navigate]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;

        try {
            await api.delete(`/products/${id}`);
            setListings((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete listing');
        }
    };

    if (loading) return <div className="text-center mt-8 text-xl">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    My Listings
                </h1>

                {listings.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg mb-4">You haven't listed anything yet.</p>
                        <button
                            onClick={() => navigate('/add-listing')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
                        >
                            Create Your First Listing
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col relative"
                            >
                                {/* SOLD Watermark */}
                                {product.sold && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30 rounded-xl">
                                        <span className="text-white text-5xl font-extrabold tracking-widest opacity-80 -rotate-12 border-4 border-white px-6 py-2 rounded-lg select-none">
                                            SOLD
                                        </span>
                                    </div>
                                )}

                                <img
                                    src={product.image || 'https://via.placeholder.com/300'}
                                    alt={product.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1 truncate">
                                            {product.title}
                                        </h3>
                                        <p className="text-blue-600 font-bold text-lg mb-2">
                                            ₹{product.price}
                                        </p>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                            {product.description}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => navigate(`/products/${product._id}`)}
                                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                                        >
                                            View
                                        </button>
                                        {!product.sold && (
                                            <button
                                                onClick={() => navigate(`/edit-listing/${product._id}`)}
                                                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition font-medium text-sm"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition font-medium text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyListingsPage;
