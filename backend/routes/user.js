const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Add to Favorites
router.post('/favorites/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.favorites.includes(req.params.productId)) {
            user.favorites.push(req.params.productId);
            await user.save();
        }
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove from Favorites
router.delete('/favorites/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.favorites = user.favorites.filter(id => id.toString() !== req.params.productId);
        await user.save();
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Favorites
router.get('/favorites', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
