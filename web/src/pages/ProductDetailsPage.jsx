import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isOwner = user && product && (user.id === product.owner || user._id === product.owner);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);

                // Check if favorite
                if (user) {
                    const favRes = await api.get('/user/favorites');
                    const favorites = favRes.data;
                    const found = favorites.find(p => p._id === id);
                    setIsFavorite(!!found);
                }
            } catch (err) {
                setError('Product not found');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, user]);

    const toggleFavorite = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            if (isFavorite) {
                await api.delete(`/user/favorites/${id}`);
                setIsFavorite(false);
            } else {
                await api.post(`/user/favorites/${id}`);
                setIsFavorite(true);
            }
        } catch (err) {
            console.error('Failed to toggle favorite', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;

        setDeleting(true);
        try {
            await api.delete(`/products/${id}`);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete listing');
            setDeleting(false);
        }
    };

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!product) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header / Back Button */}
            <div className="container mx-auto px-4 py-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
            </div>

            <div className="container mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row max-w-5xl mx-auto border border-gray-100">
                    {/* Image Section */}
                    <div className="lg:w-1/2 relative bg-gray-100 aspect-square lg:aspect-auto">
                        <img
                            src={product.image || 'https://via.placeholder.com/800'}
                            alt={product.title}
                            className="w-full h-full object-contain md:object-cover"
                        />
                        {product.sold && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                <span className="bg-red-600 text-white font-black text-4xl md:text-6xl px-8 py-4 rounded-xl border-4 border-white shadow-2xl transform -rotate-12">
                                    SOLD
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-10 lg:w-1/2 flex flex-col">
                        <div className="flex-grow">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                                    {product.title}
                                </h1>
                                <button
                                    onClick={toggleFavorite}
                                    className={`p-3 rounded-full shadow-md transition-all active:scale-95 ${isFavorite
                                        ? 'bg-red-50 text-red-500'
                                        : 'bg-gray-50 text-gray-400 hover:text-red-400'
                                        }`}
                                >
                                    <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-3xl font-black text-blue-600">₹{product.price}</span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-100">
                                    Verified Listing
                                </span>
                            </div>

                            <div className="prose prose-blue mb-8">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h3>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {product.description}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Seller Info</p>
                                        <p className="text-sm font-bold text-gray-800">User ID: {product.owner.substring(0, 8)}...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            {!isOwner && !product.sold && (
                                <button
                                    onClick={() => navigate(`/checkout/${id}`)}
                                    className="w-full py-4 px-6 rounded-xl font-black text-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    Buy Now
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            )}

                            {!isOwner && product.sold && (
                                <div className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gray-100 text-gray-400 text-center border-2 border-dashed border-gray-200">
                                    This book has been sold
                                </div>
                            )}

                            {isOwner && (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => navigate(`/edit-listing/${id}`)}
                                        className="py-3 px-6 rounded-xl font-bold bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="py-3 px-6 rounded-xl font-bold bg-white text-red-600 border-2 border-red-100 hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        {deleting ? '...' : 'Delete'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
