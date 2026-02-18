const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sold: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text' }); // For search

module.exports = mongoose.model('Product', productSchema);
