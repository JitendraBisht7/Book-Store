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
                    setError('This product has already been sold');
                }
                setProduct(res.data);
            } catch (err) {
                setError('Product not found');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, user, navigate]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError('');

        if (!address.trim() || !phone.trim()) {
            setError('Please fill in both address and phone number.');
            return;
        }

        if (!/^[6-9]\d{9}$/.test(phone.trim())) {
            setError('Please enter a valid 10-digit Indian phone number.');
            return;
        }

        setPlacing(true);
        try {
            await api.post('/orders', {
                productId: id,
                address: address.trim(),
                phone: phone.trim(),
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to place order');
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
                    <p className="text-gray-500 mb-6">Your order for <strong>{product?.title}</strong> has been placed successfully.</p>
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
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">
                    Checkout
                </h1>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Book Details */}
                    <div className="flex flex-col sm:flex-row">
                        <img
                            src={product.image || 'https://via.placeholder.com/300'}
                            alt={product.title}
                            className="w-full sm:w-48 h-48 object-cover"
                        />
                        <div className="p-6 flex-grow">
                            <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                            <p className="text-2xl font-bold text-green-600">₹{product.price}</p>
                        </div>
                    </div>

                    {/* Delivery Form */}
                    <form onSubmit={handlePlaceOrder} className="p-6 border-t space-y-5">
                        <h3 className="text-xl font-semibold text-gray-800">Delivery Details</h3>

                        {error && (
                            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Delivery Address
                            </label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your full delivery address"
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">+91</span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="9876543210"
                                    maxLength={10}
                                    className="w-full pl-14 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Book Price</span>
                                <span className="font-semibold">₹{product.price}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Delivery</span>
                                <span className="font-semibold text-green-600">FREE</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={placing || product.sold}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
                        >
                            {placing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    Processing Payment...
                                </span>
                            ) : (
                                `Pay ₹${product.price} & Place Order`
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
