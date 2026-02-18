import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img
                src={product.image || 'https://via.placeholder.com/300'}
                alt={product.title}
                className="w-full h-48 object-contain object-center bg-gray-100"
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 truncate">{product.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
                    <Link
                        to={`/products/${product._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
