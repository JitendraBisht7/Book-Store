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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                Your Favorites
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
                {favorites.length === 0 && (
                    <p className="col-span-full text-center text-gray-500 text-lg">
                        No favorites yet. Go explore!
                    </p>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
