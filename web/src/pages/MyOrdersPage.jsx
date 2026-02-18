import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const MyOrdersPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my');
                setOrders(res.data);
            } catch (err) {
                console.error('Failed to fetch orders', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (loading) return <div className="text-center mt-8 text-xl">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">
                    My Purchases
                </h1>

                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg mb-4">You haven't purchased anything yet.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
                        >
                            Browse Books
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="flex flex-col sm:flex-row">
                                    <img
                                        src={order.product?.image || 'https://via.placeholder.com/300'}
                                        alt={order.product?.title}
                                        className="w-full sm:w-40 h-40 object-cover"
                                    />
                                    <div className="p-5 flex-grow flex flex-col sm:flex-row justify-between">
                                        <div className="flex-grow">
                                            <h3
                                                className="text-xl font-semibold mb-1 cursor-pointer hover:text-blue-600 transition"
                                                onClick={() => navigate(`/products/${order.product?._id}`)}
                                            >
                                                {order.product?.title || 'Product unavailable'}
                                            </h3>
                                            <p className="text-green-600 font-bold text-lg mb-2">
                                                ₹{order.product?.price}
                                            </p>
                                            <p className="text-gray-500 text-sm mb-1">
                                                📍 {order.address}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                📞 +91 {order.phone}
                                            </p>
                                        </div>
                                        <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col items-end justify-between">
                                            <span className="bg-green-100 text-green-700 font-semibold text-xs px-3 py-1 rounded-full uppercase">
                                                {order.status}
                                            </span>
                                            <p className="text-gray-400 text-xs mt-2">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
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

export default MyOrdersPage;
