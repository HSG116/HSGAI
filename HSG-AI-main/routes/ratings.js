const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Submit a rating
router.post('/', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        
        const newRating = new Rating({
            userId: req.user._id,
            username: req.user.username,
            rating,
            comment
        });

        await newRating.save();

        res.status(201).json({
            message: 'تم إرسال التقييم بنجاح',
            rating: newRating
        });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء إرسال التقييم' });
    }
});

// Get all ratings
router.get('/', async (req, res) => {
    try {
        const ratings = await Rating.find()
            .sort({ createdAt: -1 })
            .limit(50);
        
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء جلب التقييمات' });
    }
});

// Get user's rating
router.get('/my-rating', auth, async (req, res) => {
    try {
        const rating = await Rating.findOne({ userId: req.user._id });
        res.json(rating || { message: 'لم تقم بالتقييم بعد' });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء جلب تقييمك' });
    }
});

module.exports = router; 