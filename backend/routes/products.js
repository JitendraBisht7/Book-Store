const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create Product with Image Upload (Protected)
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : '';

        const product = new Product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            image: imageUrl,
            owner: req.user._id,
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get My Products (Protected) — must be BEFORE /:id
router.get('/my', auth, async (req, res) => {
    try {
        const products = await Product.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Products (with Search & Pagination)
router.get('/', async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const query = { sold: { $ne: true } };

        if (search) {
            query.$text = { $search: search };
        }

        const products = await Product.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Product.countDocuments(query);

        res.status(200).json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Single Product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Product (with optional image upload)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
        };

        // If a new image was uploaded, update the image URL
        if (req.file) {
            updateData.image = req.file.path;
        }

        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            updateData,
            { new: true }
        );
        if (!product) return res.status(404).json({ error: 'Product not found or unauthorized' });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Product
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!product) return res.status(404).json({ error: 'Product not found or unauthorized' });
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
