import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CheckoutPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [statusCode, setStatusCode] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                if (res.data.sold) {
                    setStatusCode(400);
                    setError('(400) This product has already been sold');
                }
                setProduct(res.data);
            } catch (err) {
                const code = err.response?.status || 500;
                setStatusCode(code);
                setError(`(${code}) Product not found`);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, user, navigate]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError('');
        setStatusCode(null);

        if (!address.trim() || !phone.trim()) {
            setStatusCode(400);
            setError('(400) Please fill in both address and phone number.');
            return;
        }

        if (!/^[6-9]\d{9}$/.test(phone.trim())) {
            setStatusCode(400);
            setError('(400) Please enter a valid 10-digit Indian phone number.');
            return;
        }

        setPlacing(true);
        try {
            const response = await api.post('/orders', {
                productId: id,
                address: address.trim(),
                phone: phone.trim(),
            });
            setStatusCode(201);
            setSuccess(true);
        } catch (err) {
            const code = err.response?.status || 500;
            setStatusCode(code);
            setError(`(${code}) ${err.response?.data?.error || 'Failed to place order'}`);
        } finally {
            setPlacing(false);
        }
    };

    if (loading) return <div className="text-center mt-8 text-xl">Loading...</div>;

    // Success screen
    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Order Placed!</h2>
                    <p className="text-gray-500 mb-2">Your order for <strong>{product?.title}</strong> has been placed successfully.</p>
                    <p className="text-sm text-gray-400 mb-6">(Status: {statusCode})</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!product) return <div className="text-center mt-8 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
                        Secure <span className="text-blue-600">Checkout</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Complete your purchase to own this book</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 md:p-8 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Delivery Details
                            </h3>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-xl text-sm mb-6 animate-pulse">
                                    <span className="font-bold">Error:</span> {error}
                                </div>
                            )}

                            <form onSubmit={handlePlaceOrder} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                        Shipping Address
                                    </label>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Flat No, Building, Campus/Area name..."
                                        rows={4}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 font-medium resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+91</span>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="98765 43210"
                                            maxLength={10}
                                            className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-400 font-medium"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={placing || product.sold}
                                    className="hidden lg:block w-full bg-blue-600 text-white font-black py-5 px-8 rounded-2xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20 active:scale-[0.98] text-lg"
                                >
                                    {placing ? 'Processing...' : `Place Order — ₹${product.price}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 border border-gray-100 overflow-hidden">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>

                            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-50">
                                <img
                                    src={product.image || 'https://via.placeholder.com/300'}
                                    alt={product.title}
                                    className="w-20 h-28 object-cover rounded-xl shadow-sm"
                                />
                                <div className="flex flex-col justify-center">
                                    <h4 className="font-bold text-gray-900 line-clamp-2 mb-1">{product.title}</h4>
                                    <p className="text-blue-600 font-black">₹{product.price}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="text-gray-900 font-bold">₹{product.price}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Delivery</span>
                                    <span className="text-green-500 font-bold uppercase tracking-widest text-[10px] bg-green-50 px-2 py-0.5 rounded">Free</span>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-black text-blue-600">₹{product.price}</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-2xl p-4 flex gap-3 mb-6">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                    Your payment is secure. We use end-to-end encryption for all transactions.
                                </p>
                            </div>

                            {/* Mobile only button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={placing || product.sold}
                                className="lg:hidden w-full bg-blue-600 text-white font-black py-5 px-8 rounded-2xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20 active:scale-[0.98] text-lg"
                            >
                                {placing ? 'Processing...' : `Place Order`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
