import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const MyListingsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

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
            setStatusMessage('Listing deleted successfully (Status: 200)');
            setTimeout(() => setStatusMessage(''), 3000);
        } catch (err) {
            const code = err.response?.status || 500;
            setStatusMessage(`(${code}) ${err.response?.data?.error || 'Failed to delete listing'}`);
            setTimeout(() => setStatusMessage(''), 3000);
        }
    };

    if (loading) return <div className="text-center mt-8 text-xl">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:py-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 text-center md:text-left">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                            My <span className="text-blue-600">Listings</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Manage and track your active book listings</p>
                    </div>
                    <button
                        onClick={() => navigate('/add-listing')}
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Listing
                    </button>
                </div>

                {statusMessage && (
                    <div className={`mb-8 p-4 rounded-xl text-sm font-bold border-l-4 animate-in fade-in slide-in-from-top-4 duration-300 ${statusMessage.includes('successfully')
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'bg-red-50 border-red-500 text-red-700'
                        }`}>
                        {statusMessage}
                    </div>
                )}

                {listings.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-sm border-2 border-dashed border-gray-100 max-w-2xl mx-auto px-6">
                        <div className="w-20 h-20 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No active listings</h2>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">Share your old books with the community and make some extra cash.</p>
                        <button
                            onClick={() => navigate('/add-listing')}
                            className="bg-blue-600 text-white font-bold py-4 px-10 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10"
                        >
                            Get Started
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {listings.map((product) => (
                            <div
                                key={product._id}
                                className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                    <img
                                        src={product.image || 'https://via.placeholder.com/400x300'}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {product.sold && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px] z-10">
                                            <span className="text-white text-3xl font-black tracking-widest -rotate-12 border-4 border-white px-4 py-1.5 rounded-xl">
                                                SOLD
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">My Book</span>
                                    </div>
                                </div>

                                <div className="p-5 flex-grow flex flex-col">
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xl font-black text-blue-600">₹{product.price}</span>
                                            {product.sold && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded">Off-Market</span>}
                                        </div>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-auto">
                                        <button
                                            onClick={() => navigate(`/products/${product._id}`)}
                                            className="py-2.5 px-4 rounded-xl border-2 border-gray-100 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5"
                                        >
                                            View Details
                                        </button>
                                        {!product.sold ? (
                                            <button
                                                onClick={() => navigate(`/edit-listing/${product._id}`)}
                                                className="py-2.5 px-4 rounded-xl bg-blue-50 text-blue-600 font-black text-xs hover:bg-blue-100 transition-all flex items-center justify-center gap-1.5"
                                            >
                                                Edit Post
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="py-2.5 px-4 rounded-xl bg-red-50 text-red-600 font-black text-xs hover:bg-red-100 transition-all flex items-center justify-center gap-1.5"
                                            >
                                                Remove Post
                                            </button>
                                        )}
                                        {!product.sold && (
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="col-span-2 py-2.5 px-4 rounded-xl bg-gray-50 text-gray-400 font-bold text-xs hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-1.5"
                                            >
                                                Delete Listing
                                            </button>
                                        )}
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
