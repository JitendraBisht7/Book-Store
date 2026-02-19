const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Place Order (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const { productId, address, phone } = req.body;

        // Check product exists and is not sold
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        if (product.sold) return res.status(400).json({ error: 'This product has already been sold' });

        // Prevent buying own product
        if (product.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ error: 'You cannot buy your own product' });
        }

        // Create order
        const order = new Order({
            buyer: req.user._id,
            product: productId,
            address,
            phone,
        });
        await order.save();

        // Mark product as sold
        product.sold = true;
        await product.save();

        res.status(201).json({ status: 201, message: 'Order placed successfully!', order });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get My Orders (Protected)
router.get('/my', auth, async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('product')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
