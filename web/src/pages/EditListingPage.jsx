import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const EditListingPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [currentImage, setCurrentImage] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
                const product = res.data;

                // Check ownership
                if (product.owner !== user.id && product.owner !== user._id) {
                    navigate('/');
                    return;
                }

                setTitle(product.title);
                setPrice(product.price);
                setDescription(product.description);
                setCurrentImage(product.image);
            } catch (err) {
                const code = err.response?.status || 500;
                setStatusCode(code);
                setError(`(${code}) Failed to load listing`);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, user, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatusCode(null);

        if (!title || !price || !description) {
            setStatusCode(400);
            setError('(400) Title, price and description are required.');
            return;
        }

        setSaving(true);
        try {
            if (newImage) {
                // If new image, send as multipart form-data via a new upload approach
                const formData = new FormData();
                formData.append('title', title);
                formData.append('price', price);
                formData.append('description', description);
                formData.append('image', newImage);

                await api.put(`/products/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                // No new image, just update text fields
                await api.put(`/products/${id}`, { title, price, description });
            }

            setStatusCode(200);
            setTimeout(() => navigate(`/products/${id}`), 1500);
        } catch (err) {
            const code = err.response?.status || 500;
            setStatusCode(code);
            setError(`(${code}) ${err.response?.data?.error || 'Failed to update listing'}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center mt-8 text-xl">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">
                    Edit Listing
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
                >
                    {error && (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Book Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Price (₹)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                min="0"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                        />
                    </div>

                    {/* Current Image & Upload New */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Book Photo
                        </label>

                        {/* Show current or new preview */}
                        {(preview || currentImage) && (
                            <img
                                src={preview || currentImage}
                                alt="Book"
                                className="w-full h-52 object-cover rounded-lg mb-3"
                            />
                        )}

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <p className="text-gray-500 text-sm">
                                {preview ? 'Click to choose a different photo' : 'Click to upload a new photo (optional)'}
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditListingPage;
