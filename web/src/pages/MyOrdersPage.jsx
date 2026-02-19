import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const MyOrdersPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                const code = err.response?.status || 500;
                setError(`(${code}) Failed to fetch orders`);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (loading) return <div className="text-center mt-8 text-xl">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:py-12">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
                        My <span className="text-green-600">Purchases</span>
                    </h1>
                    <p className="text-gray-500 font-medium">History of all books you've purhcased</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-xl text-sm mb-8">
                        <span className="font-bold">Error:</span> {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-sm border-2 border-dashed border-gray-100 max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-green-50 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No purchases yet</h2>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">Your library is waiting! Find your first book today.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white font-bold py-4 px-10 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10"
                        >
                            Browse Books
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex flex-col sm:flex-row">
                                    <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-gray-50">
                                        <img
                                            src={order.product?.image || 'https://via.placeholder.com/300x400'}
                                            alt={order.product?.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3
                                                    className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors line-clamp-1"
                                                    onClick={() => navigate(`/products/${order.product?._id}`)}
                                                >
                                                    {order.product?.title || 'Product unavailable'}
                                                </h3>
                                                <span className="shrink-0 bg-green-50 text-green-600 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border border-green-100">
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-2xl font-black text-gray-900 mb-4">
                                                ₹{order.product?.price}
                                            </p>

                                            <div className="space-y-2 mb-6">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    <span className="line-clamp-1 font-medium">{order.address}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span className="font-medium">+91 {order.phone}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <p className="text-gray-400 text-xs font-medium">
                                                Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                            <button
                                                onClick={() => navigate(`/products/${order.product?._id}`)}
                                                className="text-blue-600 font-bold text-sm hover:underline"
                                            >
                                                Order Details →
                                            </button>
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
