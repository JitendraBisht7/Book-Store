import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchFavorites = async () => {
            try {
                const res = await api.get('/user/favorites');
                setFavorites(res.data);
            } catch (err) {
                console.error('Failed to fetch favorites', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [user, navigate]);

    if (loading) return <div className="text-center mt-8">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-black mb-10 text-center text-gray-900 tracking-tight">
                My <span className="text-red-500">Favorites</span>
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {favorites.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {favorites.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-100 max-w-2xl mx-auto">
                    <p className="text-gray-400 text-xl font-medium mb-4">
                        No favorites yet
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Explore some books →
                    </button>
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
