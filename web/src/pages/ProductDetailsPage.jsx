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
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
                <img
                    src={product.image || 'https://via.placeholder.com/600'}
                    alt={product.title}
                    className="w-full md:w-1/2 h-96 object-cover"
                />
                <div className="p-8 md:w-1/2 flex flex-col justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
                        <div className="flex items-center gap-3 mb-6">
                            <p className="text-2xl text-blue-600 font-bold">₹{product.price}</p>
                            {product.sold && (
                                <span className="bg-red-100 text-red-600 font-bold text-sm px-3 py-1 rounded-full">SOLD</span>
                            )}
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                        <p className="text-sm text-gray-500 mb-2">Seller ID: {product.owner}</p>
                    </div>

                    <div className="space-y-3">
                        {/* Buy Button - only for non-owners and unsold products */}
                        {!isOwner && !product.sold && (
                            <button
                                onClick={() => navigate(`/checkout/${id}`)}
                                className="w-full py-3 px-6 rounded-lg font-bold text-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition duration-300 shadow-lg"
                            >
                                Buy Now — ₹{product.price}
                            </button>
                        )}

                        {!isOwner && product.sold && (
                            <div className="w-full py-3 px-6 rounded-lg font-bold text-lg bg-gray-300 text-gray-500 text-center cursor-not-allowed">
                                Sold Out
                            </div>
                        )}

                        <button
                            onClick={toggleFavorite}
                            className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition duration-300 ${isFavorite
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>

                        {isOwner && (
                            <button
                                onClick={() => navigate(`/edit-listing/${id}`)}
                                className="w-full py-3 px-6 rounded-lg font-bold text-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                            >
                                Edit Listing
                            </button>
                        )}

                        {isOwner && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="w-full py-3 px-6 rounded-lg font-bold text-lg bg-red-600 text-white hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? 'Deleting...' : 'Delete Listing'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
